import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { env } from "@/env";

export const adminRouter = createTRPCRouter({
  getAliments: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.aliment.findMany({});
  }),
  getAlergies: protectedProcedure
    .input(z.object({ uid: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findFirst({
        where: { id: input.uid },
        select: { alergies: true },
      });
    }),
  addFood: protectedProcedure
    .input(z.object({ id: z.string().cuid(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.id != env.ADMIN_ID) return null;
      return await ctx.db.aliment.create({
        data: { name: input.name },
      });
    }),
});
