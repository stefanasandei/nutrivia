"use client";

import { type CompleteFoodProduct, type CompleteBasket } from "@/types/basket";
import "@/styles/effects.css";
import { useEffect, useMemo, useState } from "react";
import FoodCard from "./food-card";
import { Button } from "./ui/button";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ResponsiveDialog from "./responsive-dialog";
import Link from "next/link";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
          <FullBasketViewTrigger basket={basket} />
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

const FullBasketViewTrigger = ({ basket }: { basket: CompleteBasket }) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const deleteBasket = api.user.deleteBasket.useMutation({
    onSuccess: () => {
      toast("Basket deleted!");
      router.refresh();
    },
  });

  const price = useMemo(() => {
    let price = 0;

    basket.foods.forEach((food) => {
      price += food.priceRON;
    });

    return price;
  }, [basket]);

  return (
    <ResponsiveDialog
      triggerButton={
        <Button size={"sm"} variant={"default"}>
          Read more
        </Button>
      }
      title={basket.name}
      description={`Scheduled for: ${dayjs(basket.scheduledFor).fromNow()}`}
      openState={[open, setOpen]}
    >
      <div className="flex h-full flex-col justify-between">
        <ul className="list-inside list-disc text-lg">
          {basket.foods.map((food) => (
            <li key={`${basket.id}-${food.id}-full`}>
              <Link href={`/food/${food.id}`} className="hover:underline">
                {food.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mb-6 flex flex-col gap-4 md:mb-0">
          <p className="text-lg">Total: {price} RON</p>
          <div className="flex flex-row justify-between">
            <Button disabled={true}>Order now</Button>
            <Button
              onClick={() => {
                setOpen(false);
                deleteBasket.mutate({
                  baskedId: basket.id,
                });
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </ResponsiveDialog>
  );
};
