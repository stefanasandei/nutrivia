"use client";

import { type FoodProduct, type Basket, type Comment } from "@prisma/client";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { computeScore } from "@/lib/food";

export default function MainBasketsPage({
  baskets,
}: {
  baskets: ({ foods: ({ comments: Comment[] } & FoodProduct)[] } & Basket)[];
  food: FoodProduct[];
}) {
  return (
    <section className="container flex h-full flex-1 flex-col gap-6 pb-8 pt-3">
      <div className="flex flex-row items-start justify-between gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Your baskets
        </h1>
        <Link href="/basket/new" className={buttonVariants({ size: "icon" })}>
          <Icons.add />
        </Link>
      </div>
      <div className="h-full w-full items-center">
        {baskets.length == 0 && (
          <p>You didn&apos;t create any food baskets yet.</p>
        )}
        <div className="flex flex-col gap-4">
          {baskets.map((basket) => (
            <BasketPreview key={basket.id} basket={basket} />
          ))}
        </div>
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
