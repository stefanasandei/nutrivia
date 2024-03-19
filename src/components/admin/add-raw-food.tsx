/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type User } from "next-auth";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icons } from "../icons";
import ResponsiveDialog from "../responsive-dialog";
import { useEffect, useState } from "react";
import { type USDAFood, fetchRawFoodStatsFromUSDA } from "@/lib/usda";

type FormFieldType =
  | "calories"
  | "lipids"
  | "cholesterol"
  | "sodium"
  | "potassium"
  | "carbohydrate"
  | "proteins"
  | "vitaminC"
  | "calcium"
  | "iron"
  | "vitaminD"
  | "vitaminB6"
  | "vitaminB12"
  | "magnesium";

export const rawFoodProduct = {
  name: z.string(),
  calories: z.coerce.number(),
  lipids: z.coerce.number(),
  cholesterol: z.coerce.number(),
  sodium: z.coerce.number(),
  potassium: z.coerce.number(),
  carbohydrate: z.coerce.number(),
  proteins: z.coerce.number(),
  vitaminC: z.coerce.number(),
  calcium: z.coerce.number(),
  iron: z.coerce.number(),
  vitaminD: z.coerce.number(),
  vitaminB6: z.coerce.number(),
  vitaminB12: z.coerce.number(),
  magnesium: z.coerce.number(),
  vegan: z.coerce.boolean(),
};

const rawFoodProductSchema = z.object(rawFoodProduct);

export default function AddRawFoodProductForm({ user }: { user: User }) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<USDAFood[]>([]);
  const [fillInValues, setFillInValues] = useState<USDAFood | null>(null);

  useEffect(() => {
    if (fillInValues == null) return;

    const conversions = {
      calories: "Energy",
      lipids: "Total lipid (fat)",
      cholesterol: "Cholesterol",
      sodium: "Sodium, Na",
      potassium: "potassium",
      carbohydrate: "Carbohydrate, by difference",
      proteins: "Protein",
      vitaminC: "Vitamin C, total ascorbic acid",
      calcium: "Calcium, Ca",
      iron: "Iron, Fe",
      // vitaminD: "vitaminD",
      // vitaminB6: "vitaminB6",
      // vitaminB12: "vitaminB12",
      // magnesium: "magnesium",
    };

    const getValue = (val: string) => {
      for (const elem of fillInValues.foodNutrients) {
        if (elem.nutrientName == val) return elem;
      }
      return null;
    };

    for (const key of Object.keys(conversions)) {
      const field = conversions[key as keyof typeof conversions];
      if (field == null) continue;
      const val = getValue(field);
      if (val === null) continue;
      form.setValue(key as FormFieldType, val.value);
    }

    setOpen(false);
    toast("Values filled in! ✨");
  }, [fillInValues]);

  const addRawFood = api.admin.addRawFood.useMutation({
    onSuccess: () => {
      toast("Raw food record added!");
      router.refresh();
    },
  });

  const form = useForm<z.infer<typeof rawFoodProductSchema>>({
    resolver: zodResolver(rawFoodProductSchema),
    defaultValues: {
      name: "",
      calories: 0,
      lipids: 0,
      cholesterol: 0,
      sodium: 0,
      potassium: 0,
      carbohydrate: 0,
      proteins: 0,
      vitaminC: 0,
      calcium: 0,
      iron: 0,
      vitaminD: 0,
      vitaminB6: 0,
      vitaminB12: 0,
      magnesium: 0,
      vegan: true,
    },
  });

  const stuff = [
    { name: "calories", measure: "kcal" },
    { name: "lipids", measure: "g" },
    { name: "cholesterol", measure: "mg" },
    { name: "sodium", measure: "mg" },
    { name: "potassium", measure: "mg" },
    { name: "carbohydrate", measure: "g" },
    { name: "proteins", measure: "g" },
    { name: "vitaminC", measure: "mg" },
    { name: "calcium", measure: "mg" },
    { name: "iron", measure: "mg" },
    { name: "vitaminD", measure: "IU" },
    { name: "vitaminB6", measure: "mg" },
    { name: "vitaminB12", measure: "µg" },
    { name: "magnesium", measure: "g" },
  ] as const;

  function onSubmit(values: z.infer<typeof rawFoodProductSchema>) {
    addRawFood.mutate({ id: user.id, ...values });
    form.reset();
  }

  async function fetchIngredientUSDA(ingredient: string) {
    const data = await fetchRawFoodStatsFromUSDA(ingredient);
    setSearchResults(data.foods);
  }

  return (
    <Form {...form}>
      <h1 className="border-t-2 py-2 text-3xl font-bold">Add an ingredient</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <div className="flex flex-row items-center gap-3">
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <ResponsiveDialog
                  title="Choose a product"
                  description=""
                  openState={[open, setOpen]}
                  triggerButton={
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            onClick={async () => {
                              setOpen(true);
                              await fetchIngredientUSDA(field.value);
                            }}
                            disabled={!field.value}
                          >
                            <Icons.coolStars />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Fill in missing values</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  }
                >
                  {searchResults
                    .sort((a, b) => a.description.length - b.description.length)
                    .splice(0, 5)
                    .map((res) => (
                      <div
                        key={res.fdcId}
                        onClick={() => setFillInValues(res)}
                        className="my-1 w-full rounded-lg p-3 text-xl transition-all hover:cursor-pointer hover:bg-secondary"
                      >
                        {res.description}
                      </div>
                    ))}
                </ResponsiveDialog>
              </div>
              <FormDescription>
                The name of the raw food product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-flow-row gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stuff.map((thing) => (
            <FormField
              key={thing.name}
              control={form.control}
              name={thing.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {thing.name} ({thing.measure})
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>
                    The quantity of {thing.name}, expressed in {thing.measure}.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="vegan"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    onCheckedChange={field.onChange}
                    defaultChecked={field.value}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Is it vegan?</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
        <div>
          <p className="mb-2">
            You are submitting a raw food product as an admin. This will be
            directly published.
          </p>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
