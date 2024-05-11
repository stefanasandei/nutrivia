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
import { useState } from "react";
import { UploadButton } from "@/components/uploadthing";
import { Textarea } from "@/components/ui/textarea";
import ChipsInput, { type ChipOption } from "@/components/chips-input";
import { type FoodProduct } from "@prisma/client";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const NewRecipe = ({ products }: { products: FoodProduct[] }) => {
  const router = useRouter();

  const formSchema = z.object({
    title: z.string().min(1),
    ingredients: z.string().min(1),
    instructions: z.string().min(1),
  });

  const create = api.recipe.create.useMutation({
    onSuccess: async () => {
      toast("Recipe created!");

      router.push("/for-you/recipes");
    },
  });

  const [imageURL, setImageURL] = useState("");
  const [ingredientProducts, setIngredientProducts] = useState<ChipOption[]>(
    [],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      ingredients: "",
      instructions: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const content = `## Ingredients\n${values.ingredients}\n## Instructions\n${values.instructions}`;

    const body = {
      title: values.title,
      content: content,

      pictureURL: imageURL,

      ingredients: ingredientProducts.map((prod) => prod.id),
    };

    create.mutate(body);
  }

  return (
    <section className="container m-3 flex h-full w-full flex-col gap-6">
      <div className="flex flex-row justify-between gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Write a new recipe
        </h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name of your recipe.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Image (optional)</FormLabel>
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
            <FormDescription>Upload an image with the dish.</FormDescription>
            <FormMessage />
          </FormItem>
          <FormField
            control={form.control}
            name="ingredients"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ingredients</FormLabel>
                <FormControl>
                  <Textarea placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  Write a list of the required ingredients.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Ingredient products (optional)</FormLabel>
            <FormControl>
              <ChipsInput
                placeholder=""
                options={products.map((product) => ({
                  id: product.id,
                  name: product.name,
                }))}
                value={ingredientProducts}
                setValue={(newValue) => {
                  setIngredientProducts(newValue);
                }}
              />
            </FormControl>
            <FormDescription>
              Search for products listed in our catalog, to add to the
              ingredients list.
            </FormDescription>
            <FormMessage />
          </FormItem>
          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea placeholder="" {...field} />
                </FormControl>
                <FormDescription>Write a list of the steps.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>{" "}
    </section>
  );
};
