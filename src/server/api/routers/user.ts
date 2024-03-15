import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getMessaging } from "firebase-admin/messaging";

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { allergies: true }
    })
  }),
  update: protectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
        id: z.string().cuid(),
        allergies: z.array(z.object({ name: z.string(), id: z.number() })),
        vegan: z.boolean()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: { id: input.id },
        data: {
          name: input.username,
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

  getBaskets: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.basket.findMany({
        where: { createdById: ctx.session.user.id },
        include: { foods: { include: { comments: true } } }
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
    }),

  subscribeToTopic: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const registrationTokens = [
        input.token
      ];

      const topic = `topic-${ctx.session.user.id}`;

      return await getMessaging(ctx.firebaseApp).subscribeToTopic(registrationTokens, topic);
    }),
  sendNotification: protectedProcedure
    .input(z.object({ userId: z.string().optional(), title: z.string(), body: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await getMessaging(ctx.firebaseApp).send({
        notification: {
          title: input.title,
          body: input.body
        },
        topic: `topic-${!input.userId ? ctx.session.user.id : input.userId}`
      });
    })
});
