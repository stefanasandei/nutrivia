import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { env } from "@/env";
import { publicProcedure } from '../trpc';
import { removeItem } from "@/lib/array";

export const adminRouter = createTRPCRouter({
  getFoodProducts: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.foodProduct.findMany({
      include: { ingredients: true }
    });
  }),
  getRawFoodProducts: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.rawFoodProduct.findMany({});
  }),

  getAllergiesOfUser: protectedProcedure
    .input(z.object({ uid: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findFirst({
        where: { id: input.uid },
        select: { allergies: true },
      });
    }),

  deleteRawFood: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.rawFoodProduct.delete({ where: { id: input.id } });
    }),
  deleteFood: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.foodProduct.delete({ where: { id: input.id } });
    }),

  findFoodProduct: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.foodProduct.findFirst({ where: { id: input.id }, include: { ingredients: true } });
    }),

  addRawFood: protectedProcedure
    .input(z.object({ id: z.string().cuid(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.id != env.ADMIN_ID) return null;

      return await ctx.db.rawFoodProduct.create({
        data: { name: input.name },
      });
    }),
  addFood: protectedProcedure
    .input(z.object({
      id: z.string().cuid(), name: z.string(), brand: z.string(),
      weight: z.number(), price: z.number(), image: z.string(),
      ingredients: z.array(z.object({ id: z.number() }))
    }))
    .mutation(async ({ ctx, input }) => {
      if (input.id != env.ADMIN_ID) return null;

      return await ctx.db.foodProduct.create({
        data: {
          name: input.name, image: input.image, brand: input.brand, weightG: input.weight,
          priceRON: input.price, ingredients: { connect: input.ingredients }
        },
      });
    }),

  addFoodComment: protectedProcedure
    .input(z.object({ id: z.number(), comment: z.string(), userId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.foodProduct.update({
        where: { id: input.id },
        data: {
          comments: {
            create: {
              body: input.comment, createdById: input.userId
            }
          }
        }
      })
    }),
  getFoodComments: publicProcedure.input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.foodProduct.findFirst({
        where: { id: input.id },
        select: { comments: { include: { createdBy: true } } }
      })
    }),
  deleteFoodComment: protectedProcedure
    .input(z.object({ id: z.number(), uid: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.comment.delete({
        where: { id: input.id }
      })
    }),

  likeFoodProduct: protectedProcedure
    .input(z.object({
      id: z.number(),
      userId: z.string().cuid(),
      isLike: z.boolean()
    }))
    .mutation(async ({ ctx, input }) => {
      const foodPost = await ctx.db.foodProduct.findFirst({
        where: { id: input.id },
        select: { likedBy: true, dislikedBy: true }
      });

      if (input.isLike && !foodPost?.likedBy.includes(input.userId) && !foodPost?.dislikedBy.includes(input.userId)) {
        await ctx.db.foodProduct.update({
          where: { id: input.id },
          data: { likedBy: { push: input.userId } }
        });
      } else if (input.isLike && foodPost?.likedBy.includes(input.userId) && !foodPost?.dislikedBy.includes(input.userId)) {
        await ctx.db.foodProduct.update({
          where: { id: input.id },
          data: { likedBy: removeItem(foodPost.likedBy, input.userId) }
        });
      }

      if (!input.isLike && !foodPost?.dislikedBy.includes(input.userId) && !foodPost?.likedBy.includes(input.userId)) {
        await ctx.db.foodProduct.update({
          where: { id: input.id },
          data: { dislikedBy: { push: input.userId } }
        });
      } else if (!input.isLike && foodPost?.dislikedBy.includes(input.userId) && !foodPost?.likedBy.includes(input.userId)) {
        await ctx.db.foodProduct.update({
          where: { id: input.id },
          data: { dislikedBy: removeItem(foodPost.dislikedBy, input.userId) }
        });
      }

      if (input.isLike && foodPost?.dislikedBy.includes(input.userId)) {
        await ctx.db.foodProduct.update({
          where: { id: input.id },
          data: {
            dislikedBy: removeItem(foodPost.dislikedBy, input.userId),
            likedBy: { push: input.userId }
          }
        });
      } else if (!input.isLike && foodPost?.likedBy.includes(input.userId)) {
        await ctx.db.foodProduct.update({
          where: { id: input.id },
          data: {
            likedBy: removeItem(foodPost.likedBy, input.userId),
            dislikedBy: { push: input.userId }
          }
        });
      }
    })
});
