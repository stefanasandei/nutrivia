import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { removeItem } from "@/lib/array";

export const postRouter = createTRPCRouter({
  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { createdBy: true }
    });
  }),
  getBest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { likedBy: "desc" },
      include: { createdBy: true }
    });
  }),

  create: protectedProcedure
    .input(z.object({
      title: z.string(), body: z.string().optional(),
      image: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          title: input.title,
          body: input.body,
          image: input.image,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  findById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.post.findFirst({
        where: { id: input.id },
        include: { createdBy: true, comments: { include: { createdBy: true } } }
      })
    }),

  addComment: protectedProcedure
    .input(z.object({ id: z.number(), text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.update({
        where: { id: input.id },
        data: {
          comments: {
            create:
            {
              body: input.text,
              createdById: ctx.session.user.id
            }
          }
        }
      })
    }),

  deleteComment: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.comment.delete({
        where: { id: input.id }
      })
    }),
  deletePost: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: { id: input.id },
        select: { createdById: true }
      });

      if (!post || post.createdById != ctx.session.user.id)
        return null;

      return await ctx.db.post.delete({
        where: { id: input.id }
      });
    }),

  likePost: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: { id: input.id },
        select: { likedBy: true }
      });
      if (!post?.likedBy)
        return null;

      if (!post.likedBy.includes(ctx.session.user.id))
        return await ctx.db.post.update({
          where: { id: input.id },
          data: { likedBy: { push: ctx.session.user.id } }
        });

      return await ctx.db.post.update({
        where: { id: input.id },
        data: { likedBy: removeItem(post.likedBy, ctx.session.user.id) }
      })
    })
});
