"use client";

import { type CompleteFoodProduct, type CompleteBasket } from "@/types/basket";
import "@/styles/effects.css";
import { useEffect, useState } from "react";
import FoodCard from "./food-card";
import { Button } from "./ui/button";

function shiftArray<T>(prevCards: T[]): T[] {
  const newArray: T[] = [prevCards[prevCards.length - 1]!, ...prevCards];
  newArray.pop();
  return newArray;
}

export const FancyBasketPreview = ({ basket }: { basket: CompleteBasket }) => {
  const [cards, setCards] = useState<CompleteFoodProduct[]>(basket.foods);

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
          <p className="text-xl font-semibold">Basket name</p>
          <p className="text-xl font-semibold">30 RON</p>
        </div>
        <div className="flex flex-row items-center justify-between">
          {/* <Button
            size={"sm"}
            variant={"default"}
            onClick={() => alert("order")}
          >
            Order now
          </Button> */}
          <p>{new Date().toLocaleString()}</p>
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
