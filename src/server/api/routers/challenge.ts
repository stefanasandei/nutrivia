import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const challengeRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.challenges.findMany({
      include: { doneBy: true },
    });
  }),

  add: protectedProcedure
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

  delete: protectedProcedure
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

  complete: protectedProcedure
    .input(
      z.object({
        challengeId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // mark the challenge as completed
      await ctx.db.challenges.update({
        where: { id: input.challengeId },
        data: { doneBy: { connect: { id: ctx.session.user.id } } },
      });

      // add it to the completed challenges "queue"
      return await ctx.db.completedChallenge.create({
        data: {
          challengesId: input.challengeId,
          userId: ctx.session.user.id,
        },
      });
    }),

  getQueued: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.completedChallenge.findFirst({
      where: { userId: ctx.session.user.id },
      include: { challenge: true },
    });
  }),
  markSeen: protectedProcedure
    .input(z.object({ challengeId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.completedChallenge.deleteMany({
        where: {
          userId: ctx.session.user.id,
          challengesId: input.challengeId,
        },
      });
    }),
});
