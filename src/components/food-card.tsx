/* eslint-disable @next/next/no-img-element */
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import {
  type RawFoodProduct,
  type FoodProduct,
  type Comment,
} from "@prisma/client";
import Link from "next/link";
import { computeScore } from "@/lib/food";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function FoodCard({
  food,
}: {
  food: {
    comments: Comment[];
    ingredients: RawFoodProduct[];
  } & FoodProduct;
  userId: string | null;
}) {
  return (
    <Card
      key={food.id}
      className="flex h-[30rem] w-72 flex-col justify-between transition hover:cursor-pointer hover:bg-secondary/30"
    >
      <Link href={`/food/${food.id}`} className="p-0">
        <CardHeader className="flex flex-row items-start justify-between p-4">
          <div>
            <CardTitle>{food.name}</CardTitle>
            <CardDescription>
              {(() => {
                const f = food.ingredients.map((value) => value.name);
                let i = "";
                for (let j = 0; j < f.length; j++)
                  if (j != f.length - 1) i += f[j] + ", ";
                  else i += f[j];
                return i;
              })()}
            </CardDescription>
          </div>
          <div className="text-center">
            <p>{food.priceRON} RON</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <img
            className="mx-auto h-72 rounded-lg"
            src={food.image!}
            alt={food.name}
          />
        </CardContent>
      </Link>
      <CardFooter className="flex justify-between p-3">
        <Link
          href={`/food/${food.id}`}
          className={buttonVariants({ variant: "secondary", size: "sm" })}
        >
          Read more
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"secondary"} size={"sm"}>
                {computeScore(food)}% score
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Learn how we calculate{" "}
                <Link href="/forum" className="font-semibold hover:underline">
                  the quality score
                </Link>
                .
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
