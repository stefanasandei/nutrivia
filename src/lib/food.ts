import { type FoodNutriments, type Comment, type FoodProduct } from "@prisma/client";

export const computeScore = (food: { comments: Comment[] } & FoodProduct) => {
    // likes / (likes + dislikes)
    let ratio = food.likedBy.length / (food.dislikedBy.length + food.likedBy.length) * 100;
    if (Number.isNaN(ratio)) {
        // no likes and dislikes yet
        ratio = 0;
    }

    // count the number of unique comments
    let popularity = 0;
    if (food.comments.length > 0) {
        const uniqueComments = Object.values(food.comments.reduce((acc: Record<string, Comment>, comment) => {
            acc[comment.createdById] = acc[comment.createdById] ?? comment;
            return acc;
        }, {})).length;
        popularity = uniqueComments / food.comments.length * 100;
    }

    // map the nutriscore a..e -> 100..20
    const nutriscore = food.nutriScore.toLowerCase() as ('a' | 'b' | 'c' | 'd' | 'e');
    const healthScore = (() => {
        const scores = { "a": 100, "b": 80, "c": 60, "d": 40, "e": 20 };
        return scores[nutriscore] ?? 0;
    })();

    // the final score is a combination of the product's
    // healthiness and the opinion of the people
    const score = (healthScore * 80 + ratio * 15 + popularity * 5) / 100;

    // return an integer with the percent
    return Math.round(score);
}

// mostly arbitrary values
const TARGET_NUTRIMENTS = {
    "carbohydrates": 50,
    "energy": 2000,
    "fat": 30,
    "salt": 1.5,
    "saturatedFat": 10,
    "sodium": 2.3,
    "sugars": 20,
    "proteins": 50
}

export const recommendHealthyFood = (foodItems: ({ nutriments: FoodNutriments } & FoodProduct)[]): string[] => {
    const totalNutrients = foodItems.reduce((acc, foodItem) => {
        const item = foodItem.nutriments;
        acc.energy += Math.round(item.energy);
        acc.proteins += Math.round(item.proteins);
        acc.carbohydrates += Math.round(item.carbohydrates);
        acc.fat += Math.round(item.fat);
        acc.saturatedFat += Math.round(item.saturatedFat);
        acc.sodium += Math.round(item.sodium);
        acc.salt += Math.round(item.salt);
        acc.sugars += Math.round(item.sugars);
        return acc;
    }, {
        energy: 0,
        proteins: 0,
        carbohydrates: 0,
        fat: 0,
        saturatedFat: 0,
        sodium: 0,
        salt: 0,
        sugars: 0
    });

    const recommendations: { nutrient: keyof typeof TARGET_NUTRIMENTS, shortfall: number }[] = [];

    // Check the shortfall for each nutrient
    for (const nutrient in TARGET_NUTRIMENTS) {
        if (TARGET_NUTRIMENTS.hasOwnProperty(nutrient)) {
            const target = TARGET_NUTRIMENTS[nutrient as keyof typeof TARGET_NUTRIMENTS];
            const total = totalNutrients[nutrient as keyof typeof TARGET_NUTRIMENTS];
            if (total < target) {
                recommendations.push({ nutrient: nutrient as keyof typeof TARGET_NUTRIMENTS, shortfall: target - total });
            }
        }
    }

    // Sort recommendations based on criticality (largest shortfall first)
    recommendations.sort((a, b) => b.shortfall - a.shortfall);

    // Convert sorted recommendations to string format
    const sortedRecommendations: string[] = recommendations.map(recommendation =>
        `Add foods to meet ${recommendation.nutrient} target (${Math.round(recommendation.shortfall)}g missing)`
    );

    return sortedRecommendations;
}
