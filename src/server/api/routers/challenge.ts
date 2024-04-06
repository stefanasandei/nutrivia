import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const challengeRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.challenges.findMany({});
  }),

  addMilestone: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        points: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.challenges.create({
        data: {
          title: input.title,
          description: input.description,
          value: input.points,
          isMilestone: true,
        },
      });
    }),
});
