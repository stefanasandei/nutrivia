"use client";

import { type CompleteFoodProduct, type CompleteBasket } from "@/types/basket";
import "@/styles/effects.css";
import { useEffect, useMemo, useState } from "react";
import FoodCard from "./food-card";
import { Button } from "./ui/button";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function shiftArray<T>(prevCards: T[]): T[] {
  const newArray: T[] = [prevCards[prevCards.length - 1]!, ...prevCards];
  newArray.pop();
  return newArray;
}

export const FancyBasketPreview = ({ basket }: { basket: CompleteBasket }) => {
  const [cards, setCards] = useState<CompleteFoodProduct[]>(basket.foods);

  const price = useMemo(() => {
    let price = 0;

    basket.foods.forEach((food) => {
      price += food.priceRON;
    });

    return price;
  }, [basket]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCards((prevCards: CompleteFoodProduct[]) => {
        return shiftArray(prevCards);
      });
    }, 2000);

    // very important line :)
    return () => clearTimeout(timeout);
  }, [cards]);

  return (
    <div className="stack h-full w-full">
      <div className="mx-9 flex h-32 w-full flex-col justify-between rounded-b-xl border bg-card p-3 transition-all hover:bg-secondary/50 hover:backdrop-blur-2xl md:m-3">
        <div className="flex flex-row justify-between">
          <p className="text-xl font-semibold">{basket.name}</p>
          <p className="text-xl font-semibold">{price} RON</p>
        </div>
        <div className="flex flex-row items-center justify-between">
          <p>{dayjs(basket.scheduledFor).fromNow()}</p>
          <Button size={"sm"} variant={"default"}>
            Read more
          </Button>
        </div>
      </div>
      {cards.map((food) => (
        <div
          className="mx-auto flex justify-center transition-all"
          key={`${food.id}-${basket.id}`}
        >
          <FoodCard food={food} />
        </div>
      ))}
    </div>
  );
};
