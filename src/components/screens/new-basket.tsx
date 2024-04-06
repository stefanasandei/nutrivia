/* eslint-disable @next/next/no-img-element */
"use client";

import {
  type RawFoodProduct,
  type Comment,
  type FoodNutriments,
  type FoodProduct,
  type User,
} from "@prisma/client";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import ResponsiveDialog from "@/components/responsive-dialog";
import CreateBasketForm, {
  QuickFoodPreview,
} from "@/components/admin/create-basket";
import { Card, CardContent, CardHeader } from "../ui/card";
import NutriScore from "../nutri-score";
import { Icons } from "../icons";
import { computeScore, recommendHealthyFood } from "@/lib/food";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { CHALLENGES, ITALIAN_FOOD } from "@/lib/milestones";

export type FoodItem = {
  nutriments: FoodNutriments | null;
  comments: Comment[];
  ingredients: RawFoodProduct[];
} & FoodProduct;

export function CreateNewBasket({
  user,
  food,
}: {
  user: { allergies: RawFoodProduct[] } & User;
  food: FoodItem[];
}) {
  const router = useRouter();

  const completeChallenge = api.challenge.complete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const createBasket = api.user.createBasket.useMutation({
    onSuccess: async () => {
      const italian =
        foodItems.filter((item) => ITALIAN_FOOD.includes(item.id)).length > 0;
      if (italian) {
        await completeChallenge.mutateAsync({
          challengeId: CHALLENGES.ItalianForADay,
        });
      }

      toast("Basket created!");
      router.push("/dashboard");
    },
  });

  const bestFood = useMemo(() => {
    const sortedFood = food.sort((a, b) => {
      const p = computeScore(a) > computeScore(b);
      return p ? -1 : 1;
    });

    return sortedFood.slice(0, Math.min(3, sortedFood.length));
  }, [food]);

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [open, setOpen] = useState(false);

  const tips = useMemo(() => {
    return recommendHealthyFood(foodItems);
  }, [foodItems]);

  const isDisabled = useMemo(() => {
    const d = foodItems.map((item, index) => {
      const notVeganIngredients = item.ingredients.filter(
        (value) => value.vegan == false,
      );
      const isVegan = notVeganIngredients.length == 0;

      const allergies = item.ingredients.filter(
        (value) =>
          user.allergies.map((v) => v.name).includes(value.name) == true,
      );

      const disabled = (user.isVegan && !isVegan) || allergies.length > 0;
      return disabled;
    });
    return d.includes(true);
  }, [foodItems]);

  return (
    <section className="container flex h-full flex-1 flex-col gap-6 pb-8 pt-3">
      <div className="flex flex-row items-center justify-between gap-2">
        <h1 className="text-xl font-extrabold leading-tight tracking-tighter md:text-3xl">
          Create a new basket
        </h1>

        <ResponsiveDialog
          title={"Add food items"}
          description={"Create a healthy selection of food with our help."}
          triggerButton={<Button>Add an item</Button>}
          openState={[open, setOpen]}
        >
          <CreateBasketForm
            onSubmit={(items) => {
              const newItems = items.map((item) => {
                return food.find((f) => f.id == parseInt(item.id))!;
              });

              setFoodItems([...foodItems, ...newItems]);
              setOpen(false);
            }}
            food={food}
          />
        </ResponsiveDialog>
      </div>
      <div className="flex flex-1 flex-col justify-between space-y-3">
        <div className="grid h-full flex-1 grid-flow-row md:grid-cols-3">
          <div className="col-span-2 space-y-4 overflow-y-auto">
            {foodItems.length == 0 && (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-xl">Add items to get started!</p>
              </div>
            )}
            {foodItems.map((item, index) => {
              const notVeganIngredients = item.ingredients.filter(
                (value) => value.vegan == false,
              );
              const isVegan = notVeganIngredients.length == 0;

              const allergies = item.ingredients.filter(
                (value) =>
                  user.allergies.map((v) => v.name).includes(value.name) ==
                  true,
              );

              const disabled =
                (user.isVegan && !isVegan) || allergies.length > 0;

              return (
                <div
                  key={`${item.id}-${index}`}
                  className="flex w-full flex-row gap-3"
                >
                  <FoodPreview food={item} />
                  <div className="flex flex-col items-center justify-start gap-3 md:mr-3">
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      onClick={() => {
                        const arr = [...foodItems];
                        arr.splice(index, 1);
                        setFoodItems(arr);
                      }}
                    >
                      <Icons.delete />
                    </Button>

                    {user.isVegan && !isVegan && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button size={"icon"} variant={"destructive"}>
                              <Icons.warning />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            This product is not vegan!{" "}
                            <Link
                              href={`/food/${item.id}`}
                              className="font-semibold hover:underline"
                              target="_blank"
                            >
                              Learn more.
                            </Link>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    {allergies.length > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button size={"icon"} variant={"destructive"}>
                              <Icons.warning />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            This product contains {allergies.length}{" "}
                            {allergies.length > 1 ? "allergies" : "allergy"}!{" "}
                            <Link
                              href={`/food/${item.id}`}
                              className="font-semibold hover:underline"
                              target="_blank"
                            >
                              Learn more.
                            </Link>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="col-span-1 h-full md:border-l-2 md:pl-5">
            <p
              className={cn(
                "text-3xl font-semibold",
                foodItems.length == 0 ? "hidden md:block" : "",
              )}
            >
              Recommendations
            </p>

            {foodItems.length > 0 && (
              <div className="mt-3 space-y-3">
                <div>
                  <p>General tips:</p>
                  <div className="list-inside list-disc">
                    {tips.slice(0, 3).map((tip) => (
                      <p key={tip} className="list-item md:ml-3">
                        {tip}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p>Try out this healthy food:</p>
                  {bestFood.map((bfood) => (
                    <QuickFoodPreview
                      food={{
                        ...bfood,
                        id: bfood.id.toString(),
                        price: bfood.priceRON,
                        image: bfood.image!,
                      }}
                      onClick={(item) => {
                        const newItems = [item].map((item) => {
                          return food.find((f) => f.id == parseInt(item.id))!;
                        });

                        setFoodItems([...foodItems, ...newItems]);
                        setOpen(false);
                      }}
                      key={`${bfood.id}-preview`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <Button
          onClick={() =>
            createBasket.mutate({
              food: foodItems.map((item) => item.id),
            })
          }
          disabled={foodItems.length == 0 || isDisabled}
        >
          Create basket
        </Button>
      </div>
    </section>
  );
}

export function FoodPreview({ food }: { food: FoodProduct }) {
  return (
    <Card className="flex w-full flex-row justify-between p-4 transition hover:bg-secondary">
      <CardHeader className="flex flex-col gap-2 p-0">
        <p className="text-2xl">
          {food.name} - {food.weightG}g
        </p>
        <NutriScore score={food.nutriScore} isSmall={true} />
        <p>{food.priceRON} RON</p>
      </CardHeader>
      <CardContent className="p-0">
        <img
          src={food.image!}
          alt={food.name}
          className="aspect-auto max-w-20 rounded-lg"
        />
      </CardContent>
    </Card>
  );
}
