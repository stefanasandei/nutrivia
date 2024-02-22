"use client";

import { type RawFoodProduct, type FoodProduct } from "@prisma/client";
import { type User } from "next-auth";
import FoodCard from "@/components/food-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useState } from "react";

export default function ProductCatalog({
  user,
  food,
}: {
  user?: User;
  food: ({
    ingredients: RawFoodProduct[];
  } & FoodProduct)[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedFood, setSearchedFood] = useState(food.slice());

  const update = (query: string) => {
    if (query == "") setSearchedFood(food);

    const similarityScore = (str: string, query: string) => {
      const occurrences = str.split(query).length - 1;
      return occurrences;
    };

    const foodCopy = food.slice();

    setSearchedFood(
      foodCopy.sort((a, b) => {
        const scoreA = similarityScore(a.name, query);
        const scoreB = similarityScore(b.name, query);
        return scoreB - scoreA;
      }),
    );
  };

  return (
    <section className="container grid items-center gap-6 pb-8 pt-3">
      <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Food Products
        </h1>
        <div className="flex flex-row gap-4">
          <Input
            className="w-full md:max-w-80"
            placeholder="Search for a product..."
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value.target.value);
              update(value.target.value);
            }}
          />
          <Button size={"icon"} variant={"outline"} className="w-16">
            <Icons.search />
          </Button>
        </div>
      </div>
      <div className="grid grid-flow-row grid-cols-1 justify-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {searchedFood.map((item) => (
          <FoodCard key={item.id} food={item} userId={user ? user.id : null} />
        ))}
      </div>
    </section>
  );
}
