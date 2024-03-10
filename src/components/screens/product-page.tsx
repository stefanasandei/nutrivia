"use client";

import {
  type RawFoodProduct,
  type Comment,
  type FoodProduct,
  type FoodNutriments,
  type User,
} from "@prisma/client";
import Image from "next/image";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { Input } from "../ui/input";
import { api } from "@/trpc/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CommentPreview from "../comment";
import NutriScore from "../nutri-score";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";

export default function FoodProductPage({
  food,
  comments,
  user,
}: {
  food: {
    ingredients: RawFoodProduct[];
    nutriments: FoodNutriments;
  } & FoodProduct;
  comments: ({
    createdBy: User;
  } & Comment)[];
  user: ({ allergies: RawFoodProduct[] } & User) | null;
}) {
  const router = useRouter();

  const [comment, setComment] = useState("");
  const [activeSection, setActiveSection] = useState<
    "brief" | "core" | "health" | "contribute" | null
  >(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".section");
      console.log(sections);

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          setActiveSection(
            section.id as "brief" | "core" | "health" | "contribute",
          );
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const addComment = api.admin.addFoodComment.useMutation({
    onSuccess: () => {
      toast("Comment submitted!");
      router.refresh();
    },
  });

  const deleteComment = api.admin.deleteFoodComment.useMutation({
    onSuccess: () => {
      toast("Comment deleted!");
      router.refresh();
    },
  });

  const likePost = api.admin.likeFoodProduct.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <section className="container grid items-center gap-6 pt-3">
      <div className="sticky top-20 z-50 flex w-full flex-col items-center justify-between gap-2 rounded-lg bg-secondary/40 p-3 backdrop-blur-xl">
        <div className="flex w-full flex-row justify-between px-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            {food.name}
          </h1>
          <div className="flex flex-row gap-3">
            {user != null && (
              <Button
                variant="secondary"
                size={"icon"}
                onClick={() => {
                  likePost.mutate({
                    id: food.id,
                    userId: user.id,
                    isLike: true,
                  });
                }}
              >
                <Icons.like
                  fill={food.likedBy.includes(user?.id) ? "white" : "none"}
                />
              </Button>
            )}
            {user != null && (
              <Button
                variant="secondary"
                size={"icon"}
                onClick={() => {
                  likePost.mutate({
                    id: food.id,
                    userId: user.id,
                    isLike: false,
                  });
                }}
              >
                <Icons.dislike
                  fill={food.dislikedBy.includes(user?.id) ? "white" : "none"}
                />
              </Button>
            )}
            <Button size={"icon"} variant={"secondary"}>
              <Icons.share />
            </Button>
          </div>
        </div>
        <div className=" hidden w-full gap-4 px-2 sm:flex">
          <a
            href="#brief"
            className={cn(
              "rounded-lg bg-accent p-3 transition-all hover:cursor-pointer hover:bg-accent/50",
              activeSection == "brief" ? "brightness-150" : "",
            )}
          >
            <p>Brief</p>
          </a>
          {user != null && (
            <a
              href="#core"
              className={cn(
                "rounded-lg bg-accent p-3 transition-all hover:cursor-pointer hover:bg-accent/50",
                activeSection == "core" ? "brightness-150" : "",
              )}
            >
              <p>For you</p>
            </a>
          )}
          <a
            href="#health"
            className={cn(
              "rounded-lg bg-accent p-3 transition-all hover:cursor-pointer hover:bg-accent/50",
              activeSection == "health" ? "brightness-150" : "",
            )}
          >
            <p>Health</p>
          </a>
          <a
            href="#contribute"
            className={cn(
              "rounded-lg bg-accent p-3 transition-all hover:cursor-pointer hover:bg-accent/50",
              activeSection == "contribute" ? "brightness-150" : "",
            )}
          >
            <p>Contribute</p>
          </a>
        </div>
      </div>

      <div className="section" id="brief">
        <BriefProductCard food={food} />
      </div>
      {user != null && (
        <div className="section" id="core">
          <CoreInfoCard food={food} allergies={user.allergies} />
        </div>
      )}
      <div className="section" id="health">
        <HealthCard food={food} />
      </div>

      <div className="section flex w-full flex-col gap-3" id="contribute">
        {user != null && (
          <div className="flex w-full flex-row gap-5">
            <Input
              placeholder="Write a comment here!"
              value={comment}
              onChange={(newValue) => setComment(newValue.target.value)}
            />
            <Button
              size={"icon"}
              onClick={() => {
                addComment.mutate({
                  id: food.id,
                  comment: comment,
                  userId: user.id,
                });
                setComment("");
              }}
            >
              <Icons.send />
            </Button>
          </div>
        )}
        <div>
          {comments.map((comment) => {
            return (
              <div
                key={comment.id}
                className="flex w-full flex-row items-center justify-center"
              >
                <CommentPreview comment={comment} />
                {user?.id == comment.createdById && (
                  <Button
                    size={"icon"}
                    onClick={() => {
                      deleteComment.mutate({ id: comment.id, uid: user.id });
                    }}
                  >
                    <Icons.delete />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const BriefProductCard = ({
  food,
}: {
  food: { ingredients: RawFoodProduct[] } & FoodProduct;
}) => {
  return (
    <div className="flex flex-col items-start gap-5 border-b-2 border-b-secondary py-5 md:grid md:grid-cols-3 md:gap-2">
      <h1 className="mb-3 text-3xl md:hidden">
        {food.name} - {food.brand} - {food.weightG}g
      </h1>
      <Image
        className="rounded-lg"
        src={food.image!}
        width={350}
        height={200}
        alt={food.name}
      />
      <div className="col-span-2 grid h-full w-full md:grid-rows-5">
        <h1 className="mb-3 hidden text-3xl md:row-span-1 md:flex md:text-5xl">
          {food.name} - {food.brand} - {food.weightG}g
        </h1>
        <div className="flex flex-col gap-3 md:row-span-3 md:max-h-[30vh] md:justify-evenly">
          <h1 className="text-2xl">
            <span className="font-semibold">Brand</span>: {food.brand}
          </h1>
          <h1 className="text-2xl">
            <span className="font-semibold">Quantity</span>: {food.weightG} g
          </h1>
          <h1 className="text-2xl">
            <span className="font-semibold">Price</span>: {food.priceRON} RON
          </h1>
          <h1 className="text-2xl">
            <span className="font-semibold">Country of origin</span>:{" "}
            {food.originCountry}
          </h1>
          <div className="text-2xl">
            <span className="font-semibold">Ingredients</span>:{" "}
            {food.ingredients.map((ingredient, index) => {
              const isLast = index == food.ingredients.length - 1;
              return (
                <span key={ingredient.name}>
                  <span className="hover:cursor-pointer hover:underline">
                    {ingredient.name}
                  </span>
                  {!isLast ? ", " : ""}
                </span>
              );
            })}
          </div>
          <h1 className="text-2xl">
            <span className="font-semibold">EAN Code</span>: {food.ean}
          </h1>
        </div>
        <div className="mt-3 flex h-full w-full flex-col rounded-lg bg-secondary/30 p-3 md:row-span-2">
          <h1 className="mb-5 text-3xl font-bold">Help us!</h1>
          <p>
            Leave a review down bellow, so we can estimate the quality of the
            product.
          </p>
        </div>
      </div>
    </div>
  );
};

const CoreInfoCard = ({
  allergies: userAllergies,
  food,
}: {
  allergies: RawFoodProduct[];
  food: {
    ingredients: RawFoodProduct[];
    nutriments: FoodNutriments;
  } & FoodProduct;
}) => {
  const notVeganIngredients = food.ingredients.filter(
    (value) => value.vegan == false,
  );
  const isVegan = notVeganIngredients.length == 0;

  const allergies = food.ingredients.filter(
    (value) => userAllergies.map((v) => v.name).includes(value.name) == true,
  );

  return (
    <div className="mt-3 h-full w-full rounded-lg bg-secondary/30 p-3">
      <h1 className="mb-3 text-3xl font-bold">For you</h1>
      <div className="flex flex-col gap-3">
        {!isVegan ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not vegan!</AlertTitle>
            <AlertDescription>
              The following ingredients are not vegan:{" "}
              {notVeganIngredients.map((v) => v.name).toString()}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>This product is vegan!</AlertTitle>
            <AlertDescription>
              Your session has expired. Please log in again.
            </AlertDescription>
          </Alert>
        )}

        {allergies.length != 0 ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Contains allergies!</AlertTitle>
            <AlertDescription>
              you have allergies to the following ingredients:{" "}
              {allergies.map((v) => v.name).toString()}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No allergies present!</AlertTitle>
            <AlertDescription>
              This product contains no known allergies you have registered.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

const HealthCard = ({
  food,
}: {
  food: {
    ingredients: RawFoodProduct[];
    nutriments: FoodNutriments;
  } & FoodProduct;
}) => {
  const nutriments = () => {
    return [
      {
        name: "carbohydrates",
        unit: "g",
        value: food.nutriments.carbohydrates,
      },
      { name: "energy       ", unit: "g", value: food.nutriments.energy },
      { name: "fat          ", unit: "g", value: food.nutriments.fat },
      { name: "proteins     ", unit: "g", value: food.nutriments.proteins },
      { name: "salt         ", unit: "g", value: food.nutriments.salt },
      { name: "saturatedFat ", unit: "g", value: food.nutriments.saturatedFat },
      { name: "sodium       ", unit: "g", value: food.nutriments.sodium },
      { name: "sugars       ", unit: "g", value: food.nutriments.sugars },
    ];
  };

  return (
    <div className="mt-3 flex h-full w-full flex-col gap-4 rounded-lg bg-secondary/30 p-3">
      <h1 className="text-3xl font-bold">Health info</h1>
      <div className="text-xl">
        <span className="font-semibold">Ingredients</span>:{" "}
        {food.ingredients.map((ingredient, index) => {
          const isLast = index == food.ingredients.length - 1;
          return (
            <span key={ingredient.name}>
              <span className="hover:cursor-pointer hover:underline">
                {ingredient.name}
              </span>
              {!isLast ? ", " : ""}
            </span>
          );
        })}
      </div>
      <div>
        <p className="mb-3 text-xl font-semibold">Nutriments:</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nutrition facts </TableHead>
              <TableHead>As sold for 100 g / 100 ml </TableHead>
              <TableHead>Normal value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nutriments().map((nutriment) => (
              <TableRow key={nutriment.name}>
                <TableCell>{nutriment.name}</TableCell>
                <TableCell>
                  {nutriment.value} {nutriment.unit}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <p className="mb-3 text-xl font-semibold">NutriScore:</p>
        <div className="flex flex-col items-start gap-6 md:flex-row">
          <NutriScore score={food.nutriScore} />
          <p className="">What is the NutriScore? lorem ipsum</p>
        </div>
      </div>
    </div>
  );
};
