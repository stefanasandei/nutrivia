import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { createdBy: true }
    });
  }),
  getBest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { comments: { _count: "desc" } },
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
});
