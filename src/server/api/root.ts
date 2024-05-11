import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { adminRouter } from "./routers/admin";
import { challengeRouter } from "./routers/challenge";
import { recipeRouter } from "./routers/recipe";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  admin: adminRouter,
  challenge: challengeRouter,
  recipe: recipeRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
