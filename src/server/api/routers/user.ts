import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { getMessaging } from "firebase-admin/messaging";

export const userRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    if (ctx.session == null) return null;

    return await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { allergies: true, completedChallenges: true },
    });
  }),
  findByUsername: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findUnique({
        where: { name: input.username },
        include: { allergies: true, completedChallenges: true },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
        bio: z.string(),
        id: z.string().cuid(),
        allergies: z.array(z.object({ name: z.string(), id: z.number() })),
        vegan: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: { id: input.id },
        data: {
          name: input.username,
          bio: input.bio,
          isVegan: input.vegan,
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

  getBaskets: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.basket.findMany({
      where: { createdById: ctx.session.user.id },
      include: { foods: { include: { comments: true, ingredients: true } } },
    });
  }),
  createBasket: protectedProcedure
    .input(
      z.object({
        food: z.array(z.number()),
        name: z.string().optional(),
        scheduledFor: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.basket.create({
        data: {
          createdById: ctx.session.user.id,
          name: input.name,
          scheduledFor: input.scheduledFor,
          foods: {
            connect: input.food.map((id) => {
              return { id: id };
            }),
          },
        },
      });
    }),
  deleteBasket: protectedProcedure
    .input(
      z.object({
        baskedId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.basket.delete({
        where: {
          id: input.baskedId,
          createdById: ctx.session.user.id,
        },
      });
    }),

  subscribeToTopic: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const registrationTokens = [input.token];

      const topic = `topic-${ctx.session.user.id}`;

      return await getMessaging(ctx.firebaseApp).subscribeToTopic(
        registrationTokens,
        topic,
      );
    }),
  sendNotification: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        title: z.string(),
        body: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await getMessaging(ctx.firebaseApp).send({
        notification: {
          title: input.title,
          body: input.body,
        },
        topic: `topic-${!input.userId ? ctx.session.user.id : input.userId}`,
      });
    }),
});
