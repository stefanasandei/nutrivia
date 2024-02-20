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
import { Icons } from "@/components/icons";
import { type FoodProduct } from "@prisma/client";
import Link from "next/link";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export default function FoodCard({
  food,
  userId,
}: {
  food: {
    ingredients: {
      id: number;
      name: string;
      image: string | null;
    }[];
  } & FoodProduct;
  userId: string | null;
}) {
  const router = useRouter();
  const apiContext = api.useUtils();

  const likePost = api.admin.likeFoodProduct.useMutation({
    onSuccess: async () => {
      router.refresh();
      await apiContext.admin.getFoodProducts.invalidate();
    },
  });

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
        <Button variant={"secondary"}>
          {food.likedBy.length - food.dislikedBy.length} score
        </Button>
      </CardFooter>
    </Card>
  );
}
