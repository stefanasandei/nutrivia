"use client";

import { type CompleteFoodProduct, type CompleteBasket } from "@/types/basket";
import "@/styles/effects.css";
import { useEffect, useState } from "react";
import FoodCard from "./food-card";

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
      <div className="m-3 h-24 w-full rounded-b-lg bg-secondary p-3">
        Basket TODO
      </div>
      {cards.map((food) => (
        <div className="transition-all" key={`${food.id}-${basket.id}`}>
          <FoodCard food={food} />
        </div>
      ))}
    </div>
  );
};
