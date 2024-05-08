import {
    type FoodProduct,
    type Basket,
    type Comment,
    type RawFoodProduct,
} from "@prisma/client";

export type CompleteFoodProduct = ({
    comments: Comment[];
    ingredients: RawFoodProduct[];
} & FoodProduct)

export type CompleteBasket = {
    foods: CompleteFoodProduct[];
} & Basket;
