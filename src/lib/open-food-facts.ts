import { z } from "zod";

const OpenFoodIngredientValidatior = z.object({
    id: z.string(),
    percent_estimate: z.number(),
    text: z.string(),
    vegan: z.string()
});

export type OpenFoodIngredient = z.infer<typeof OpenFoodIngredientValidatior>;

const OpenFoodProductValidator = z.object({
    product: z.object({
        allergens_from_ingredients: z.string(),
        allergens_hierarchy: z.array(z.string()),
        brands: z.string(),
        product_name: z.string(),
        image_front_url: z.string(),
        ingredients_hierarchy: z.array(z.string()),
        nutriscore_grade: z.string(),
    }),
    status_verbose: z.string()
});

export type OpenFoodProduct = z.infer<typeof OpenFoodProductValidator>;

export const getOpenFoodData = async (ean: string): Promise<OpenFoodProduct> => {
    const url = `https://world.openfoodfacts.net/api/v2/product/${ean}`;
    const res = await fetch(url);
    const data: OpenFoodProduct = OpenFoodProductValidator.parse(await res.json());

    return data;
}
