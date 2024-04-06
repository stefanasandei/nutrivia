import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

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

  complete: publicProcedure
    .input(
      z.object({
        challengeId: z.string().uuid(),
        userId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const challenge = await ctx.db.challenges.findFirst({
        where: { id: input.challengeId },
        select: { doneBy: true },
      });

      const userId = ctx.session == null ? input.userId : ctx.session.user.id;

      const isDone =
        challenge?.doneBy.filter((usr) => {
          return usr.id == userId;
        }).length == 1;
      if (isDone) return true;

      // mark the challenge as completed
      await ctx.db.challenges.update({
        where: { id: input.challengeId },
        data: { doneBy: { connect: { id: userId } } },
      });

      // this table is for keeping track of
      // dates when users completed challenges
      await ctx.db.trackedChallange.create({
        data: {
          challengesId: input.challengeId,
          userId: userId!,
        },
      });

      // add it to the completed challenges "queue"
      return await ctx.db.completedChallenge.create({
        data: {
          challengesId: input.challengeId,
          userId: userId!,
        },
      });
    }),

  getCompleted: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.trackedChallange.findMany({
      where: { userId: ctx.session.user.id },
      include: { challenge: true },
    });
  }),

  getQueued: publicProcedure.query(async ({ ctx }) => {
    if (ctx.session == null) return null;

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

  getDaily: protectedProcedure.query(async ({ ctx }) => {
    const notCompleted = await ctx.db.challenges.findMany({
      where: { doneBy: { none: { id: ctx.session.user.id } } },
    });

    return notCompleted[notCompleted.length - 1];
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.challenges.findFirst({
        where: { id: input.id },
      });
    }),
});
