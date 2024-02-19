"use client";

import { type FoodProduct } from "@prisma/client";
import { type User } from "next-auth";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "../ui/button";
import { Icons } from "../icons";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function FoodList({
  food,
}: {
  user: User;
  food: ({
    ingredients: {
      id: number;
      name: string;
      image: string | null;
    }[];
  } & FoodProduct)[];
}) {
  const router = useRouter();

  const deleteFood = api.admin.deleteFood.useMutation({
    onSuccess: (data: FoodProduct) => {
      toast(`Deleted food item "${data.name}"!`);
      router.refresh();
    },
  });

  return (
    <div>
      <h1 className="border-t-2 py-2 text-3xl font-bold">Food products</h1>
      <Table>
        <TableCaption>A list of recent food products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Weight (grams)</TableHead>
            <TableHead>Price (RON)</TableHead>
            <TableHead>Ingredients</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {food.map((food) => (
            <TableRow key={food.id}>
              <TableCell>{food.name}</TableCell>
              <TableCell>{food.brand}</TableCell>
              <TableCell>{food.weightG} g</TableCell>
              <TableCell>{food.priceRON} RON</TableCell>
              <TableCell>
                {(() => {
                  const f = food.ingredients.map((value) => value.name);
                  let i = "";
                  for (let j = 0; j < f.length; j++)
                    if (j != f.length - 1) i += f[j] + ", ";
                    else i += f[j];
                  return <p>{i}</p>;
                })()}
              </TableCell>
              <TableCell>
                <Image
                  style={{
                    height: "100%",
                    width: "auto",
                  }}
                  className="rounded-md"
                  width={30}
                  height={30}
                  src={food.image!}
                  alt={food.name}
                />
              </TableCell>
              <TableCell className="flex flex-row gap-3">
                <Dialog>
                  <DialogTrigger
                    className={buttonVariants({
                      variant: "outline",
                      size: "icon",
                    })}
                  >
                    <Icons.delete />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the food product.
                      </DialogDescription>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            onClick={() => {
                              deleteFood.mutate({ id: food.id });
                            }}
                          >
                            Delete &quot;{food.name}&quot;
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  onClick={() => {
                    toast(`Updating food ${food.id}`);
                  }}
                >
                  <Icons.update />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
