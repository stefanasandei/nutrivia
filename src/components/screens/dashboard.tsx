/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  type FoodProduct,
  type Basket,
  type Comment,
  type Challenges,
  type TrackedChallange,
} from "@prisma/client";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { computeScore } from "@/lib/food";
import { Calendar } from "../ui/calendar";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ResponsiveDialog from "../responsive-dialog";

export default function MainBasketsPage({
  completedChallenges,
  dailyChallenge,
  baskets,
}: {
  completedChallenges: (TrackedChallange & { challenge: Challenges })[];
  dailyChallenge: Challenges;
  baskets: ({ foods: ({ comments: Comment[] } & FoodProduct)[] } & Basket)[];
  food: FoodProduct[];
}) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [openDayDialog, setOpenDayDialog] = useState(false);

  const [selectedBaskets, setSelectedBaskets] = useState<
    ({ foods: ({ comments: Comment[] } & FoodProduct)[] } & Basket)[]
  >([]);
  const [selectedChallenges, setSelectedChallenges] = useState<Challenges[]>(
    [],
  );

  useEffect(() => {
    if (date == undefined) return;

    setOpenDayDialog(true);

    setSelectedBaskets(
      baskets.filter((b) => {
        return (
          b.createdAt.getDate() == date.getDate() &&
          b.createdAt.getMonth() == date.getMonth()
        );
      }),
    );

    setSelectedChallenges(
      completedChallenges
        .filter((b) => {
          return (
            b.completedOn.getDate() == date.getDate() &&
            b.completedOn.getMonth() == date.getMonth()
          );
        })
        .map((c) => c.challenge),
    );
  }, [date]);

  return (
    <section className="container m-3 flex h-full w-full flex-col gap-6 pb-4">
      <div className="flex flex-row content-center items-start justify-between gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Progress dashboard
        </h1>
        <div className="flex flex-col justify-between gap-2 md:flex-row">
          <Link href="/dashboard/new" className={buttonVariants()}>
            Create a basket
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"outline"}>Daily challenge</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex flex-row justify-between">
                  <p>{dailyChallenge.title}</p>
                  <p>
                    {dailyChallenge.value} point
                    {dailyChallenge.value == 1 ? "" : "s"}
                  </p>
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {dailyChallenge.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Ok</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <ResponsiveDialog
        description=""
        title={`Statistics for ${date?.toLocaleDateString("ro-RO") ?? ""}`}
        openState={[openDayDialog, setOpenDayDialog]}
        triggerButton={<></>}
      >
        {selectedBaskets.map((basket) => (
          <BasketPreview key={basket.id} basket={basket} />
        ))}
        {selectedBaskets.length == 0 && <p>No baskets for this day!</p>}

        {selectedChallenges.length > 0 && (
          <div>
            <p>Challenges completed:</p>
            <ul className="list ml-5 list-disc">
              {selectedChallenges.map((challenge) => (
                <li key={challenge.id}>{challenge.title}</li>
              ))}
            </ul>
          </div>
        )}

        {selectedChallenges.length == 0 && <p>No challenges for this day!</p>}
      </ResponsiveDialog>
      <Calendar
        mode="single"
        baskets={baskets}
        selected={date}
        onSelect={setDate}
        className="flex h-full w-full flex-1 rounded-md border"
      />
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
