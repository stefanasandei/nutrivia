import { type Comment, type FoodProduct } from "@prisma/client";

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
