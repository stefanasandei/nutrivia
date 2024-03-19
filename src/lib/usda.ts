import { env } from "@/env";
import { z } from "zod";

// here we are using the United States Department of Agriculture API to fetch ingredient data

const USDAIngredientValidatior = z.object({
    nutrientId: z.number(),
    nutrientName: z.string(),
    value: z.number(),
});

const USDAFoodValidator = z.object({
    fdcId: z.number(),
    description: z.string(),
    foodNutrients: z.array(USDAIngredientValidatior)
});

const USDAResponseValidator = z.object({
    totalHits: z.number(),
    foods: z.array(USDAFoodValidator)
});

export type USDAIngredient = z.infer<typeof USDAIngredientValidatior>;
export type USDAFood = z.infer<typeof USDAFoodValidator>;
export type USDAResponse = z.infer<typeof USDAResponseValidator>;

export const fetchRawFoodStatsFromUSDA = async (foodName: string): Promise<USDAResponse> => {
    const API_ENDPOINT = "https://api.nal.usda.gov/fdc/v1/foods";
    const url = `${API_ENDPOINT}/search?query=${encodeURIComponent(foodName)}&api_key=${env.NEXT_PUBLIC_USDA_KEY}`;

    const res = await fetch(url);
    const data: USDAResponse = USDAResponseValidator.parse(await res.json());

    return data;
}
