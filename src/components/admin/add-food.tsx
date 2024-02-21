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
import ChipsInput, { type ChipOption } from "../chips-input";
import { useState } from "react";
import { type RawFoodProduct } from "@prisma/client";
import { UploadButton } from "../uploadthing";

const formSchema = z.object({
  name: z.string(),
  brand: z.string(),
  originCountry: z.string(),
  nutriScore: z.string(),
  ean: z.string(),
  weight: z.coerce.number(),
  price: z.coerce.number(),
});

export default function AddFoodProductForm({
  user,
  rawFood,
}: {
  user: User;
  rawFood: RawFoodProduct[];
}) {
  const router = useRouter();

  const [ingredients, setIngredients] = useState<ChipOption[]>([]);
  const [imageURL, setImageURL] = useState("");

  const addFood = api.admin.addFood.useMutation({
    onSuccess: () => {
      toast("Food record added!");
      router.refresh();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      brand: "",
      originCountry: "",
      nutriScore: "",
      ean: "",
      weight: 0,
      price: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addFood.mutate({
      id: user.id,
      name: values.name,
      brand: values.brand,
      weight: values.weight,
      price: values.price,
      originCountry: values.originCountry,
      nutriScore: values.nutriScore,
      ean: values.ean,
      image: imageURL,
      ingredients: ingredients.map((value) => {
        return { id: value.id };
      }),
    });
    form.reset();
    setIngredients([]);
  }

  return (
    <Form {...form}>
      <h1 className="border-t-2 py-2 text-3xl font-bold">Add a food product</h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" w-full space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>The name of the food product.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  The brand of the food product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (grams)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormDescription>
                  The weight of the food product in grams.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (RON)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormDescription>
                  The price of the food product in RON.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="originCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country of origin</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  The country where the product was grown or produced in.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nutriScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nutri Score</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  The Nutri-Score of the food product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ean"
            render={({ field }) => (
              <FormItem>
                <FormLabel>EAN Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>The EAN of the food product.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormItem>
          <FormLabel>Image</FormLabel>
          <FormControl>
            <UploadButton
              className="flex flex-row items-center justify-start gap-3 ut-button:bg-primary ut-button:text-primary-foreground ut-button:transition ut-button:hover:bg-primary/90"
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                setImageURL(res[0]?.url ?? "");
              }}
              onUploadError={(error: Error) => {
                alert(
                  `Please refresh the page and try again. Upload error: ${error.message}`,
                );
              }}
            />
          </FormControl>
          <FormDescription>
            Upload an image with the food product.
          </FormDescription>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Ingredients</FormLabel>
          <FormControl>
            <ChipsInput
              placeholder="Ingredients"
              options={rawFood.map((value) => {
                return {
                  name: value.name,
                  id: value.id,
                };
              })}
              value={ingredients}
              setValue={(newValue) => {
                setIngredients(newValue);
              }}
            />
          </FormControl>
          <FormDescription>
            Add here all ingredients of the product.
          </FormDescription>
          <FormMessage />
        </FormItem>
        <div>
          <p className="mb-2">
            You are submitting a food product as an admin. This will be directly
            published.
          </p>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
