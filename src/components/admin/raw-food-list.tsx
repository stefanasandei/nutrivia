"use client";

import { type RawFoodProduct } from "@prisma/client";
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

export default function RawFoodList({
  rawFood,
}: {
  user: User;
  rawFood: RawFoodProduct[];
}) {
  const router = useRouter();

  const deleteRawFood = api.admin.deleteRawFood.useMutation({
    onSuccess: (data: RawFoodProduct) => {
      toast(`Deleted raw food item "${data.name}"!`);
      router.refresh();
    },
  });

  const stuff = (rawFood: RawFoodProduct) => {
    return [
      { name: "calories", measure: "kcal", value: rawFood.calories },
      { name: "lipids", measure: "g", value: rawFood.lipids },
      { name: "cholesterol", measure: "mg", value: rawFood.cholesterol },
      { name: "sodium", measure: "mg", value: rawFood.sodium },
      { name: "potassium", measure: "mg", value: rawFood.potassium },
      { name: "carbohydrate", measure: "g", value: rawFood.carbohydrate },
      { name: "proteins", measure: "g", value: rawFood.proteins },
      { name: "vitaminC", measure: "mg", value: rawFood.vitaminC },
      { name: "calcium", measure: "mg", value: rawFood.calcium },
      { name: "iron", measure: "mg", value: rawFood.iron },
      { name: "vitaminD", measure: "IU", value: rawFood.vitaminD },
      { name: "vitaminB6", measure: "mg", value: rawFood.vitaminB6 },
      { name: "vitaminB12", measure: "µg", value: rawFood.vitaminB12 },
      { name: "magnesium", measure: "g", value: rawFood.magnesium },
    ] as const;
  };

  return (
    <div>
      <h1 className="border-t-2 py-2 text-3xl font-bold">Raw food products</h1>
      <Table>
        <TableCaption>A list of recent raw food products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden md:table-cell">Internal ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">
              Nutrition Values
            </TableHead>
            <TableHead className="hidden md:table-cell">Vegan</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rawFood.map((food) => (
            <TableRow key={food.id}>
              <TableCell className="hidden md:table-cell">{food.id}</TableCell>
              <TableCell>{food.name}</TableCell>
              <TableCell className="hidden md:table-cell">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">View</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Nutrition values for {food.name}
                      </DialogTitle>
                      <DialogDescription>
                        <Table>
                          <TableCaption>
                            A list of your recent invoices.!!
                          </TableCaption>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Substance</TableHead>
                              <TableHead>Median quantity</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {stuff(food).map((subst) => (
                              <TableRow key={subst.name}>
                                <TableCell>{subst.name}</TableCell>
                                <TableCell>
                                  {subst.value} {subst.measure}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {food.vegan ? <Icons.check /> : <Icons.close />}
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
                        delete the raw food product.
                      </DialogDescription>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            onClick={() => {
                              deleteRawFood.mutate({ id: food.id });
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
                    toast(`Updating raw food ${food.id}`);
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
