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

  return (
    <div>
      <h1 className="border-t-2 py-2 text-3xl font-bold">Raw food products</h1>
      <Table>
        <TableCaption>A list of recent raw food products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Internal ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rawFood.map((food) => (
            <TableRow key={food.id}>
              <TableCell>{food.id}</TableCell>
              <TableCell>{food.name}</TableCell>
              <TableCell>?</TableCell>
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
