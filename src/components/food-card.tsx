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
      className="flex h-full w-[300px] flex-col justify-between transition hover:cursor-pointer hover:bg-secondary/30"
    >
      <Link href={`/food/${food.id}`} className="">
        <CardHeader className="flex flex-row items-start justify-between">
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
          <div>
            <p>{food.priceRON} RON</p>
          </div>
        </CardHeader>
        <CardContent>
          <Image
            className="rounded-lg"
            src={food.image!}
            width={250}
            height={100}
            alt={food.name}
          />
        </CardContent>
      </Link>
      <CardFooter className="flex justify-between">
        <Link
          href={`/food/${food.id}`}
          className={buttonVariants({ variant: "secondary" })}
        >
          Discuss
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"secondary"}>{computeScore(food)}% score</Button>
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
