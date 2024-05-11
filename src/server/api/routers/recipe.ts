import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";

// TODO
export const recipeRouter = createTRPCRouter({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.user.findUnique({
            where: { id: ctx.session.user.id },
            select: { recipes: { include: { ingredients: true } } }
        })
    }),

    create: protectedProcedure.input(z.object({
        title: z.string(),
        content: z.string(),
        pictureURL: z.string().optional(),
        ingredients: z.array(z.number()),
    })).mutation(async ({ input, ctx }) => {
        return await ctx.db.recipe.create({
            data: {
                title: input.title,
                generated: false,
                content: input.content,
                pictureURL: input.pictureURL,
                ingredients: { connect: input.ingredients.map((ing) => ({ id: ing })) },
                userId: ctx.session.user.id
            }
        })
    })
});
