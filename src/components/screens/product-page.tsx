"use client";

import { type Comment, type FoodProduct } from "@prisma/client";
import Image from "next/image";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { Input } from "../ui/input";
import { api } from "@/trpc/react";
import { type User } from "next-auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function FoodProductPage({
  food,
  comments,
  user,
}: {
  food: {
    ingredients: {
      id: number;
      name: string;
      image: string | null;
    }[];
  } & FoodProduct;
  comments: Comment[];
  user: User | null;
}) {
  const router = useRouter();
  const score = (food.likes / (food.likes + food.dislikes)) * 100;

  // todo: maybe have the ingredients link to a page about each of them with info
  const ingredientsList = (
    ingredients: {
      id: number;
      name: string;
      image: string | null;
    }[],
  ) => {
    const f = ingredients.map((value) => value.name);
    let i = "";
    for (let j = 0; j < f.length; j++)
      if (j != f.length - 1) i += f[j] + ", ";
      else i += f[j];
    return i;
  };

  const addComment = api.admin.addFoodComment.useMutation({
    onSuccess: () => {
      toast("Comment submitted!");
      router.refresh();
    },
  });

  const [comment, setComment] = useState("");

  return (
    <section className="container grid items-center gap-6 pb-8 pt-3">
      <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          {food.name}
        </h1>
      </div>
      <div className="grid grid-cols-1 items-start gap-5 border-b-2 border-b-secondary py-5 md:grid-cols-3 md:gap-2">
        <div className="col-span-1">
          <Image
            className="rounded-lg"
            src={food.image!}
            width={350}
            height={200}
            alt={food.name}
          />
        </div>
        <div className="flex h-full flex-col justify-between">
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
              <span className="font-bold">Ingredients</span>:{" "}
              {ingredientsList(food.ingredients)}
            </h1>
          </div>
          <div className="mt-3 flex w-full flex-row gap-3 sm:mt-0">
            <Button variant="secondary" size={"icon"}>
              <Icons.like />
            </Button>
            <Button variant="secondary" size={"icon"}>
              <Icons.dislike />
            </Button>
          </div>
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
            // todo: comment ui
            return <div key={comment.id}>{comment.body}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
