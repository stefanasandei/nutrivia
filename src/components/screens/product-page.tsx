"use client";

import {
  type RawFoodProduct,
  type Comment,
  type FoodProduct,
} from "@prisma/client";
import Image from "next/image";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { Input } from "../ui/input";
import { api } from "@/trpc/react";
import { type User } from "next-auth";
import { useState } from "react";
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

// TODO: use nutriments instead of values computed from ingredients

/*
TODO Plan:
  - refactor this page to add nutriments
  - refactor the trpc api to create and link nutriments
  - refact food products list to view nutriments
  - new food product page to showcase nutriments
  - compute nutriscore (when missing) based on nutriments

  - stats for the basket based on nutriments
  - check basket and feed for alergies
*/

export default function FoodProductPage({
  food,
  comments,
  user,
}: {
  food: {
    ingredients: RawFoodProduct[];
  } & FoodProduct;
  comments: ({
    createdBy: User;
  } & Comment)[];
  user: User | null;
}) {
  const router = useRouter();
  const score =
    (food.likedBy.length / (food.likedBy.length + food.dislikedBy.length)) *
    100;

  const ingredientsList = (ingredients: RawFoodProduct[]) => {
    const f = ingredients.map((value) => value.name);
    let i = "";
    for (let j = 0; j < f.length; j++)
      if (j != f.length - 1) i += f[j] + ", ";
      else i += f[j];
    return i;
  };

  // yup. (ctrl + middle click)
  const sumIngredients = (ingredients: RawFoodProduct[]) => {
    return {
      calories: ingredients.reduce((sum, a) => sum + a.calories, 0),
      lipids: ingredients.reduce((sum, a) => sum + a.lipids, 0),
      cholesterol: ingredients.reduce((sum, a) => sum + a.cholesterol, 0),
      sodium: ingredients.reduce((sum, a) => sum + a.sodium, 0),
      potassium: ingredients.reduce((sum, a) => sum + a.potassium, 0),
      carbohydrate: ingredients.reduce((sum, a) => sum + a.carbohydrate, 0),
      proteins: ingredients.reduce((sum, a) => sum + a.proteins, 0),
      vitaminC: ingredients.reduce((sum, a) => sum + a.vitaminC, 0),
      calcium: ingredients.reduce((sum, a) => sum + a.calcium, 0),
      iron: ingredients.reduce((sum, a) => sum + a.iron, 0),
      vitaminD: ingredients.reduce((sum, a) => sum + a.vitaminD, 0),
      vitaminB6: ingredients.reduce((sum, a) => sum + a.vitaminB6, 0),
      vitaminB12: ingredients.reduce((sum, a) => sum + a.vitaminB12, 0),
      magnesium: ingredients.reduce((sum, a) => sum + a.magnesium, 0),
    };
  };

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

  const stuff = (rawFood: ReturnType<typeof sumIngredients>) => {
    return [
      { name: "calories", measure: "kcal", value: rawFood.calories },
      { name: "lipids", measure: "g", value: rawFood.lipids },
      { name: "cholesterol", measure: "mg", value: rawFood.cholesterol },
      // { name: "sodium", measure: "mg", value: rawFood.sodium },
      // { name: "potassium", measure: "mg", value: rawFood.potassium },
      // { name: "carbohydrate", measure: "g", value: rawFood.carbohydrate },
      { name: "proteins", measure: "g", value: rawFood.proteins },
      { name: "vitaminC", measure: "mg", value: rawFood.vitaminC },
      { name: "calcium", measure: "mg", value: rawFood.calcium },
      { name: "iron", measure: "mg", value: rawFood.iron },
      { name: "vitaminD", measure: "IU", value: rawFood.vitaminD },
      // { name: "vitaminB6", measure: "mg", value: rawFood.vitaminB6 },
      // { name: "vitaminB12", measure: "µg", value: rawFood.vitaminB12 },
      { name: "magnesium", measure: "g", value: rawFood.magnesium },
    ] as const;
  };

  const nutritionTable = stuff(sumIngredients(food.ingredients));

  const [comment, setComment] = useState("");

  return (
    <section className="container grid items-center gap-6 pt-3">
      <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          {food.name}
        </h1>
      </div>
      <div className="grid grid-cols-1 items-start gap-5 border-b-2 border-b-secondary py-5 md:grid-cols-3 md:gap-2">
        <Image
          className="rounded-lg"
          src={food.image!}
          width={350}
          height={200}
          alt={food.name}
        />
        <div className="flex h-full flex-col space-y-4">
          <div className="col-span-2 flex flex-col gap-3">
            <h1 className="text-3xl">
              <span className="font-bold">Brand</span>: {food.brand}
            </h1>
            <h1 className="text-3xl">
              <span className="font-bold">Weight</span>: {food.weightG} g
            </h1>
            <h1 className="text-3xl">
              <span className="font-bold">Price</span>: {food.priceRON} RON
            </h1>
            <h1 className="text-3xl">
              <span className="font-bold">Social Score</span>:{" "}
              {Number.isNaN(score) ? 100 : score}%
            </h1>
            <h1 className="text-3xl">
              <span className="font-bold">Country of origin</span>:{" "}
              {food.originCountry}
            </h1>
            <h1 className="text-3xl">
              <span className="font-bold">Ingredients</span>:{" "}
              {ingredientsList(food.ingredients)}
            </h1>
            <NutriScore score={food.nutriScore} />
          </div>
          {user != null && (
            <div className="mt-3 flex w-full flex-row gap-3 sm:mt-0">
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
            </div>
          )}
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Substance</TableHead>
                <TableHead>Median quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nutritionTable.map((subst) => (
                <TableRow key={subst.name}>
                  <TableCell>{subst.name}</TableCell>
                  <TableCell>
                    {subst.value} {subst.measure}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex w-full flex-col gap-3">
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
