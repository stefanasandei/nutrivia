"use client";

import { type FoodProduct } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ResponsiveDialog from "@/components/responsive-dialog";
import CreateBasketForm, {
  type BriefFoodData,
} from "@/components/admin/create-basket";

export function CreateNewBasket({ food }: { food: FoodProduct[] }) {
  const router = useRouter();

  const createBasket = api.user.createBasket.useMutation({
    onSuccess: () => {
      toast("Basket created!");
      router.push("/basket");
    },
  });

  const [foodItems, setFoodItems] = useState<BriefFoodData[]>([]);
  const [open, setOpen] = useState(false);

  return (
    <section className="container flex h-full flex-1 flex-col gap-6 pb-8 pt-3">
      <div className="flex flex-row items-center justify-between gap-2">
        <h1 className="text-xl font-extrabold leading-tight tracking-tighter md:text-3xl">
          Create a new basket
        </h1>

        <ResponsiveDialog
          title={"Add food items"}
          description={"Create a healthy selection of food with our help."}
          triggerButton={<Button>Add an item</Button>}
          openState={[open, setOpen]}
        >
          <CreateBasketForm
            onSubmit={(items) => {
              setFoodItems([...foodItems, ...items]);
              setOpen(false);
            }}
            food={food}
          />
        </ResponsiveDialog>
      </div>
      <div className="h-full w-full items-center">
        <p>{JSON.stringify(foodItems)}</p>
      </div>
    </section>
  );
}
