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
    })
});
