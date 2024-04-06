import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const challengeRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.challenges.findMany({
      include: { doneBy: true },
    });
  }),

  addChallenge: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        completionMsg: z.string(),
        points: z.number(),
        isMilestone: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.challenges.create({
        data: {
          title: input.title,
          description: input.description,
          completionMsg: input.completionMsg,
          value: input.points,
          isMilestone: input.isMilestone,
        },
      });
    }),

  deleteChallenge: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.challenges.delete({
        where: { id: input.id },
      });
    }),
});
