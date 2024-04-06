"use client";

import { type FoodProduct, type Basket, type Comment } from "@prisma/client";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { computeScore } from "@/lib/food";
import { Calendar } from "../ui/calendar";
import { useState } from "react";

export default function MainBasketsPage({
  baskets,
}: {
  baskets: ({ foods: ({ comments: Comment[] } & FoodProduct)[] } & Basket)[];
  food: FoodProduct[];
}) {
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <section className="container flex h-full flex-1 flex-col gap-6 pb-8 pt-3">
      <div className="flex h-full w-full flex-1 flex-col gap-4">
        <div className="flex flex-col justify-between gap-2 md:flex-row">
          <h1 className="text-3xl font-bold">Progress dashboard</h1>
          <div className="flex flex-col justify-between gap-2 md:flex-row">
            <Button>Create a basket</Button>
            <Button variant={"outline"}>Daily challenge</Button>
          </div>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="flex h-full w-full flex-1 rounded-md border"
        />
      </div>
    </section>
  );
}

function BasketPreview({
  basket,
}: {
  basket: { foods: ({ comments: Comment[] } & FoodProduct)[] } & Basket;
}) {
  const formatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });
  const formattedDate = formatter.format(basket.createdAt);

  const score =
    basket.foods.reduce((acc, curr) => acc + computeScore(curr), 0) /
    basket.foods.length;

  return (
    <div className="flex w-full flex-col gap-4 md:ml-6">
      <h1 className="text-2xl font-semibold md:list-item">
        Basket from {formattedDate}:
      </h1>
      <p>Products: </p>
      <div className="flex flex-row gap-2">
        {basket.foods.map((foodItem) => (
          <Link
            key={foodItem.id}
            href={`/food/${foodItem.id}`}
            className="relative transition hover:cursor-pointer hover:brightness-50"
          >
            <div
              className="relative aspect-square h-16 w-16 rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${foodItem.image})` }}
            ></div>
          </Link>
        ))}
      </div>
      <p>
        Total price:{" "}
        {basket.foods.reduce((acc, curr) => acc + curr.priceRON, 0)} RON
      </p>
      <p>Health score: {score}%</p>
    </div>
  );
}
