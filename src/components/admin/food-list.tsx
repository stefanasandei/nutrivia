"use client";

import {
  type RawFoodProduct,
  type FoodProduct,
  type FoodNutriments,
} from "@prisma/client";
import { type User } from "next-auth";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "../ui/button";
import { Icons } from "../icons";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function FoodList({
  food,
}: {
  user: User;
  food: ({
    ingredients: RawFoodProduct[];
    nutriments: FoodNutriments;
  } & FoodProduct)[];
}) {
  const router = useRouter();

  const deleteFood = api.admin.deleteFood.useMutation({
    onSuccess: (data: FoodProduct) => {
      toast(`Deleted food item "${data.name}"!`);
      router.refresh();
    },
  });

  const nutriments = (index: number) => {
    if (food[index]?.nutriments == undefined) return [];

    return [
      {
        name: "carbohydrates",
        unit: "g",
        value: food[index]!.nutriments.carbohydrates,
      },
      {
        name: "energy",
        unit: "g",
        value: food[index]!.nutriments.energy,
      },
      { name: "fat", unit: "g", value: food[index]!.nutriments.fat },
      {
        name: "proteins",
        unit: "g",
        value: food[index]!.nutriments.proteins,
      },
      { name: "salt", unit: "g", value: food[index]!.nutriments.salt },
      {
        name: "saturatedFat",
        unit: "g",
        value: food[index]!.nutriments.saturatedFat,
      },
      {
        name: "sodium",
        unit: "g",
        value: food[index]!.nutriments.sodium,
      },
      {
        name: "sugars",
        unit: "g",
        value: food[index]!.nutriments.sugars,
      },
    ];
  };

  return (
    <div>
      <h1 className="border-t-2 py-2 text-3xl font-bold">Food products</h1>
      <Table>
        <TableCaption>A list of recent food products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Brand</TableHead>
            <TableHead className="hidden md:table-cell">
              Weight (grams)
            </TableHead>
            <TableHead className="hidden md:table-cell">Price (RON)</TableHead>
            <TableHead className="hidden md:table-cell">Ingredients</TableHead>
            <TableHead className="hidden md:table-cell">Nutriments</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {food.map((food, index) => (
            <TableRow key={food.id}>
              <TableCell>{food.name}</TableCell>
              <TableCell className="hidden md:table-cell">
                {food.brand}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {food.weightG} g
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {food.priceRON} RON
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {(() => {
                  const f = food.ingredients.map((value) => value.name);
                  let i = "";
                  for (let j = 0; j < f.length; j++)
                    if (j != f.length - 1) i += f[j] + ", ";
                    else i += f[j];
                  return <p>{i}</p>;
                })()}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Dialog>
                  <DialogTrigger
                    className={buttonVariants({
                      variant: "outline",
                    })}
                  >
                    View
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nutriments</DialogTitle>
                      <DialogDescription>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nutrition facts </TableHead>
                              <TableHead>As sold for 100 g / 100 ml </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {nutriments(index).map((nutriment) => (
                              <TableRow key={nutriment.name}>
                                <TableCell>{nutriment.name}</TableCell>
                                <TableCell>
                                  {nutriment.value} {nutriment.unit}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>
                <Image
                  style={{
                    height: "100%",
                    width: "auto",
                  }}
                  className="rounded-md"
                  width={30}
                  height={30}
                  src={food.image!}
                  alt={food.name}
                />
              </TableCell>
              <TableCell className="flex flex-row gap-3">
                <Dialog>
                  <DialogTrigger
                    className={buttonVariants({
                      variant: "outline",
                      size: "icon",
                    })}
                  >
                    <Icons.delete />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the food product.
                      </DialogDescription>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            onClick={() => {
                              deleteFood.mutate({ id: food.id });
                            }}
                          >
                            Delete &quot;{food.name}&quot;
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <Button
                  size={"icon"}
                  title={"Update product"}
                  variant={"outline"}
                  onClick={() => {
                    toast(`Updating food ${food.id}`);
                  }}
                >
                  <Icons.update />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
