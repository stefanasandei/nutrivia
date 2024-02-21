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

export const rawFoodProduct = {
  name: z.string(),
  calories: z.number(),
  lipids: z.number(),
  cholesterol: z.number(),
  sodium: z.number(),
  potassium: z.number(),
  carbohydrate: z.number(),
  proteins: z.number(),
  vitaminC: z.number(),
  calcium: z.number(),
  iron: z.number(),
  vitaminD: z.number(),
  vitaminB6: z.number(),
  vitaminB12: z.number(),
  magnesium: z.number(),
};

const rawFoodProductSchema = z.object(rawFoodProduct);

export default function AddRawFoodProductForm({ user }: { user: User }) {
  const router = useRouter();

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

  return (
    <Form {...form}>
      <h1 className="border-t-2 py-2 text-3xl font-bold">
        Add a raw food product
      </h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
