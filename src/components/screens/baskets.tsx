"use client";

import { type FoodProduct, type Basket } from "@prisma/client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import ResponsiveDialog from "../responsive-dialog";
import CreateBasketForm from "../admin/create-basket";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function MainBasketsPage({
  baskets,
  food,
}: {
  baskets: ({ foods: FoodProduct[] } & Basket)[];
  food: FoodProduct[];
}) {
  const router = useRouter();

  const createBasket = api.user.createBasket.useMutation({
    onSuccess: () => {
      toast("Basket created!");
      router.refresh();

      // hack to close the dialog without passing state, data binding, etc.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const btn: HTMLButtonElement = document.querySelector(
        "#radix-\\:r0\\: > button",
      )!;
      btn.click();
    },
  });

  return (
    <section className="container flex h-full flex-1 flex-col gap-6 pb-8 pt-3">
      <div className="flex flex-row items-start justify-between gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Your baskets
        </h1>

        <ResponsiveDialog
          title={"Create a basket"}
          description={"Create a healthy selection of food with our help."}
          triggerButton={
            <Button size={"icon"} variant={"default"}>
              <Icons.add />
            </Button>
          }
        >
          <CreateBasketForm
            onSubmit={(items) => createBasket.mutate({ food: items })}
            food={food}
          />
        </ResponsiveDialog>
      </div>
      <div className="h-full w-full items-center">
        {baskets.length == 0 && (
          <p>You didn&apos;t create any food baskets yet.</p>
        )}
        <div className="flex flex-col gap-4">
          {baskets.map((basket) => (
            <BasketPreview key={basket.id} basket={basket} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BasketPreview({
  basket,
}: {
  basket: { foods: FoodProduct[] } & Basket;
}) {
  return (
    <div className="flex w-full flex-row items-center gap-4">
      <h1 className="text-2xl">Basket #{basket.id}:</h1>
      {basket.foods.map((foodItem, i) => (
        <div
          className="relative transition hover:cursor-pointer hover:brightness-50"
          key={foodItem.id + i.toString()}
        >
          <div
            className="relative aspect-square h-16 w-16 rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${foodItem.image})` }}
          >
            <Icons.check className="absolute right-0 top-0 size-6 -translate-y-1/3 translate-x-1/3 transform rounded-full bg-blue-500" />
          </div>
        </div>
      ))}
    </div>
  );
}
