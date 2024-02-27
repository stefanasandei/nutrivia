"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { type User } from "next-auth";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ChipsInput, { type ChipOption } from "../chips-input";
import { useState } from "react";
import { type RawFoodProduct } from "@prisma/client";
import { UploadButton } from "../uploadthing";
import { Icons } from "../icons";
import {
  type OpenFoodProduct,
  getOpenFoodData,
  type OpenFoodIngredient,
} from "@/lib/open-food-facts";
import Image from "next/image";

const formSchema = z.object({
  name: z.string(),
  brand: z.string(),
  originCountry: z.string(),
  nutriScore: z.string(),
  ean: z.string(),
  weight: z.coerce.number(),
  price: z.coerce.number(),
  createPlaceholder: z.boolean(),
});

export default function AddFoodProductForm({
  rawFood,
  isHidden,
  isAdmin,
}: {
  user?: User;
  rawFood: RawFoodProduct[];
  isHidden?: boolean;
  isAdmin?: boolean;
}) {
  const router = useRouter();

  const [ingredients, setIngredients] = useState<ChipOption[]>([]);
  const [imageURL, setImageURL] = useState("");
  const [openNutritionData, setOpenNutritionData] =
    useState<OpenFoodIngredient | null>(null);

  const addFood = api.admin.addFood.useMutation({
    onSuccess: () => {
      toast("Food record added!");
      router.refresh();
    },
  });

  const addFoodSubmission = api.admin.createFoodSubmission.useMutation({
    onSuccess: () => {
      toast("Food submission sent!");
      router.push("/");
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
      createPlaceholder: true,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const body = {
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
    };

    if (!isHidden) {
      addFood.mutate(body);
    } else {
      addFoodSubmission.mutate(body);
    }

    // TODO: replace with nutriments
    // no placeholder anymore
    if (openNutritionData != null) {
      // push placeholder
    }

    form.reset();
    setIngredients([]);
  }

  const [apiLoading, setApiLoading] = useState(false);
  function fillInValues() {
    setApiLoading(true);

    getOpenFoodData(form.getValues().ean)
      .then((data) => {
        setApiLoading(false);

        actuallyFillValues(data);
      })
      .catch((err) => {
        setApiLoading(false);
        console.log(err);

        toast("Generative fill failed. Please check the EAN code.");
      });
  }

  function actuallyFillValues(data: OpenFoodProduct) {
    form.setValue("brand", data.product.brands);
    form.setValue("nutriScore", data.product.nutriscore_grade);
    form.setValue("weight", parseInt(data.product.product_quantity));

    setImageURL(data.product.image_front_url);

    // also nutriments
    // create a placeholder obj in state
    // if that thing is not checked, create the placeholder ingredient and link it

    // TODO: grab the nutritional values and create a placeholder ingredient
    // also image + feedback that nutrition is set
    // and also add ingredients or just hide that box

    // setOpenNutritionData({});
    // todo: create nutriments tables
    // instead of a placeholder, each food will have linked a nutriments data obj

    toast("Values filled in ✨");
    setTimeout(() => {
      toast("Beaware we couldn't find all values!");
    }, 750);
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
        <FormField
          control={form.control}
          name="ean"
          render={({ field }) => (
            <FormItem>
              <FormLabel>EAN Code</FormLabel>
              <div className="flex flex-row items-center gap-3">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        disabled={!field.value || apiLoading}
                        onClick={() => fillInValues()}
                      >
                        <Icons.coolStars />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Fill in missing values</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <FormDescription>The EAN of the food product.</FormDescription>
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
          {isAdmin && (
            <FormField
              control={form.control}
              name="createPlaceholder"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Calculate nutrition values based on provided ingredients
                    </FormLabel>
                    <FormDescription>
                      If not, we&apos;ll use vendor provided information. Choose
                      only if you&apos;re sure.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          )}
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
          <div className="flex h-full flex-row items-center">
            {!imageURL && <p>no image uploaded</p>}
            {imageURL && (
              <Image
                style={{
                  height: "100%",
                  width: "auto",
                }}
                className="rounded-md"
                width={128}
                height={128}
                src={imageURL}
                alt={form.getValues("name")}
              />
            )}
          </div>
        </div>
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
          {isAdmin && (
            <p className="mb-2">
              You are submitting a food product as an admin. This will be
              directly published.
            </p>
          )}
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
