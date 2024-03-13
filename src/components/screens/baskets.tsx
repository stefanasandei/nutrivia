"use client";

import { type FoodProduct, type Basket } from "@prisma/client";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

export default function MainBasketsPage({
  baskets,
}: {
  baskets: ({ foods: FoodProduct[] } & Basket)[];
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
  basket: { foods: FoodProduct[] } & Basket;
}) {
  return (
    <div className="flex w-full flex-row items-center gap-4">
      <h1 className="text-2xl">Basket #{basket.id}:</h1>
      {basket.foods.map((foodItem, i) => (
        <div
          className="relative transition hover:cursor-pointer hover:brightness-50"
          key={foodItem.id + i.toString()}
        >
          <div
            className="relative aspect-square h-16 w-16 rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${foodItem.image})` }}
          >
            <Icons.check className="absolute right-0 top-0 size-6 -translate-y-1/3 translate-x-1/3 transform rounded-full bg-blue-500" />
          </div>
        </div>
      ))}
    </div>
  );
}
