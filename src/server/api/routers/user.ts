import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
        id: z.string().cuid(),
        allergies: z.array(z.object({ name: z.string(), id: z.number() })),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: { id: input.id },
        data: {
          name: input.username,
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
});
