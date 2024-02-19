import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Icons } from "@/components/icons";
import { type FoodProduct } from "@prisma/client";

export default function FoodCard({
  food,
}: {
  food: {
    ingredients: {
      id: number;
      name: string;
      image: string | null;
    }[];
  } & FoodProduct;
}) {
  return (
    <Card
      className="flex w-[300px] flex-col justify-between transition hover:cursor-pointer hover:bg-secondary/30"
      key={food.id}
    >
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
      <CardFooter className="flex justify-between">
        <div className="flex flex-row gap-3">
          <Button variant="secondary" size={"icon"}>
            <Icons.like />
          </Button>
          <Button variant="secondary" size={"icon"}>
            <Icons.dislike />
          </Button>
        </div>
        <Button variant="secondary">Discuss</Button>
      </CardFooter>
    </Card>
  );
}
