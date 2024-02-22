import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
        id: z.string().cuid(),
        allergies: z.array(z.object({ name: z.string(), id: z.number() })),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: { id: input.id },
        data: {
          name: input.username,
          allergies: {
            set: input.allergies.map((val) => {
              return {
                id: val.id,
              };
            }),
          },
        },
      });
    }),

  getBaskets: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.basket.findMany({
        where: { createdById: ctx.session.user.id },
        include: { foods: true }
      });
    }),
  createBasket: protectedProcedure
    .input(z.object({ food: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.basket.create({
        data: {
          createdById: ctx.session.user.id,
          foods: { connect: input.food.map((id) => { return { id: id } }) }
        }
      });
    })
});
