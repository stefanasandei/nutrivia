"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { type CompleteBasket } from "@/types/basket";
import { type FoodProduct } from "@prisma/client";

let interval: NodeJS.Timeout;

export const CardStack = ({
  basket,
  offset,
  scaleFactor,
}: {
  basket: CompleteBasket;
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset ?? 10;
  const SCALE_FACTOR = scaleFactor ?? 0.06;
  const [cards, setCards] = useState<FoodProduct[]>(basket.foods);

  useEffect(() => {
    startFlipping();

    return () => clearInterval(interval);
  }, []);
  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: FoodProduct[]) => {
        const newArray = [...prevCards]; // create a copy of the array
        newArray.unshift(newArray.pop()!); // move the last element to the front
        return newArray;
      });
    }, 5000);
  };

  return (
    <div className="relative  h-60 w-60 md:h-60 md:w-96">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="absolute flex h-60 w-60 flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-4 shadow-xl shadow-black/[0.1]  dark:border-white/[0.1] dark:bg-black dark:shadow-white/[0.05] md:h-60 md:w-96"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
              zIndex: cards.length - index, //  decrease z-index for the cards that are behind
            }}
          >
            {/* <FoodCard food={card} userId={null} /> */}
          </motion.div>
        );
      })}
    </div>
  );
};
