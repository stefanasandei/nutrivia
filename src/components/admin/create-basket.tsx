/* eslint-disable @next/next/no-img-element */
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Icons } from "../icons";
import { type FoodProduct } from "@prisma/client";
import MiniSearch from "minisearch";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import NutriScore from "../nutri-score";

export default function CreateBasketForm({
  food,
  onSubmit,
}: {
  food: FoodProduct[];
  onSubmit: (items: BriefFoodData[]) => void;
}) {
  const miniSearch = useMemo(() => {
    const ms = new MiniSearch({
      fields: ["name"],
      storeFields: ["name", "image", "id", "priceRON", "nutriScore"],
    });

    ms.addAll(food);

    return ms;
  }, [food]);

  const [searchQuery, setSearchQuery] = useState("");
  const results = useMemo(
    () => miniSearch.search(searchQuery, { prefix: true }),
    [searchQuery, miniSearch],
  );

  const [foodItems, setFoodItems] = useState<BriefFoodData[]>([]);

  const addNewItem = (item: BriefFoodData) => {
    setFoodItems([...foodItems, item]);
  };

  const removeFoodItem = (index: number) => {
    const copy = [...foodItems];
    copy.splice(index, 1);
    setFoodItems(copy);
  };

  return (
    <form
      className={
        "flex h-full flex-1 flex-col items-start justify-between gap-4"
      }
    >
      <div className="flex h-full w-full flex-col gap-3">
        <div className="flex w-full flex-col gap-3">
          <Label>Search for food products</Label>
          <div className="flex flex-row gap-2">
            <Input
              placeholder="Type here"
              value={searchQuery}
              onChange={(value) => setSearchQuery(value.target.value)}
            />
            <Button size={"icon"} className="w-12" title="Search product">
              <Icons.search />
            </Button>
          </div>
        </div>
        <div className="flex max-h-[35svh] w-full flex-col gap-3 overflow-y-auto">
          {results.map((res) => (
            <QuickFoodPreview
              food={{
                id: res.id as string,
                name: res.name as string,
                price: res.priceRON as number,
                nutriScore: res.nutriScore as string,
                image: res.image as string,
              }}
              onClick={(newFood) => addNewItem(newFood)}
              key={res.id as string}
            />
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col gap-3">
        <div className="grid grid-cols-5 gap-2">
          {foodItems.map((foodItem, i) => (
            <div
              className="relative transition hover:cursor-pointer hover:brightness-50"
              key={foodItem.id + i.toString()}
              onClick={() => removeFoodItem(i)}
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
        <Button
          type="submit"
          className="w-full transition"
          onClick={(event) => {
            event.preventDefault();
            onSubmit(foodItems);
          }}
          disabled={foodItems.length == 0}
        >
          Add {foodItems.length} items
        </Button>
      </div>
    </form>
  );
}

export type BriefFoodData = {
  name: string;
  image: string;
  price: number;
  nutriScore: string;
  id: string;
};

export function QuickFoodPreview({
  food,
  onClick,
}: {
  food: BriefFoodData;
  onClick: (selectedFood: BriefFoodData) => void;
}) {
  return (
    <Card
      onClick={() => onClick(food)}
      className="flex flex-row justify-between p-4 transition hover:cursor-pointer hover:bg-secondary"
    >
      <CardHeader className="flex flex-col gap-2 p-0">
        <p className="text-xl">{food.name}</p>
        <NutriScore score={food.nutriScore} isSmall={true} />
        <p>{food.price} RON</p>
      </CardHeader>
      <CardContent className="p-0">
        <img
          src={food.image}
          alt={food.name}
          className="aspect-auto max-w-20 rounded-lg"
        />
      </CardContent>
    </Card>
  );
}
