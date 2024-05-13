"use client";

import {
  type RawFoodProduct,
  type FoodProduct,
  type Comment,
} from "@prisma/client";
import { type User } from "next-auth";
import FoodCard from "@/components/food-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useMemo, useState } from "react";
import MiniSearch from "minisearch";

export default function ProductCatalog({
  food,
}: {
  user?: User;
  food: ({
    comments: Comment[];
    ingredients: RawFoodProduct[];
  } & FoodProduct)[];
}) {
  const miniSearch = useMemo(() => {
    const ms = new MiniSearch({
      fields: ["name"],
      storeFields: ["id"],
      searchOptions: {
        prefix: true,
        fuzzy: 0.2,
      },
    });

    ms.addAll(food);

    return ms;
  }, [food]);

  const [searchQuery, setSearchQuery] = useState("");
  const results = useMemo(() => {
    const searchResults = miniSearch.search(searchQuery);
    const results = searchResults.map(
      (res) => food.find((elem) => elem.id == parseInt(res.id as string))!,
    );

    return results;
  }, [searchQuery, miniSearch, food]);

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
            }}
          />
          <Button size={"icon"} variant={"outline"} className="w-16">
            <Icons.search />
          </Button>
        </div>
      </div>
      <div className="grid grid-flow-row grid-cols-1 justify-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(results.length == 0 ? food : results).map((item) => (
          <FoodCard key={item.id} food={item} />
        ))}
      </div>
    </section>
  );
}
