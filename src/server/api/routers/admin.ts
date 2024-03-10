import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { env } from "@/env";
import { publicProcedure } from '../trpc';
import { removeItem } from "@/lib/array";

export const adminRouter = createTRPCRouter({
  getFoodProducts: protectedProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.foodProduct.findMany({
      include: { ingredients: true, comments: true },
      where: { isHidden: false }
    });

    // *the algorithm*
    const computeScore = (a: typeof products[0]) => {
      const ratio = a.likedBy.length - a.dislikedBy.length;
      const score = ratio * 8 / 10 + a.comments.length * 2 / 10;
      return score;
    }

    products.sort((a, b) => {
      const res = computeScore(a) > computeScore(b);
      return res ? 1 : -1;
    })

    return products;
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
      return await ctx.db.foodProduct.findFirst({
        where: { id: input.id },
        include: { ingredients: true, nutriments: true }
      });
    }),

  addRawFood: protectedProcedure
    .input(z.object({
      id: z.string().cuid(), name: z.string(),
      calories: z.number(),
      lipids: z.number(),
      cholesterol: z.number(),
      sodium: z.number(),
      potassium: z.number(),
      carbohydrate: z.number(),
      proteins: z.number(),
      vitaminC: z.number(),
      calcium: z.number(),
      iron: z.number(),
      vitaminD: z.number(),
      vitaminB6: z.number(),
      vitaminB12: z.number(),
      magnesium: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (input.id != env.ADMIN_ID) return null;

      return await ctx.db.rawFoodProduct.create({
        data: {
          name: input.name,
          calories: input.calories,
          lipids: input.lipids,
          cholesterol: input.cholesterol,
          sodium: input.sodium,
          potassium: input.potassium,
          carbohydrate: input.carbohydrate,
          proteins: input.proteins,
          vitaminC: input.vitaminC,
          calcium: input.calcium,
          iron: input.iron,
          vitaminD: input.vitaminD,
          vitaminB6: input.vitaminB6,
          vitaminB12: input.vitaminB12,
          magnesium: input.magnesium,
        },
      });
    }),
  addFood: protectedProcedure
    .input(z.object({
      isHidden: z.boolean().optional().default(false),
      name: z.string(), brand: z.string(),
      weight: z.number(), price: z.number(),
      image: z.string(),
      originCountry: z.string(),
      nutriScore: z.string(),
      ean: z.string(),
      ingredients: z.array(z.object({ id: z.number() })),
      nutriments: z.object({
        carbohydrates: z.number(),
        energy: z.number(),
        fat: z.number(),
        proteins: z.number(),
        salt: z.number(),
        sodium: z.number(),
        sugars: z.number(),
      })
    }))
    .mutation(async ({ ctx, input }) => {
      let isHidden = input.isHidden;
      if (ctx.session.user.id != env.ADMIN_ID)
        isHidden = true;

      return await ctx.db.foodProduct.create({
        data: {
          isHidden: isHidden,
          name: input.name, image: input.image,
          brand: input.brand, weightG: input.weight,
          originCountry: input.originCountry,
          nutriScore: input.nutriScore,
          ean: input.ean,
          priceRON: input.price, ingredients: { connect: input.ingredients },
          nutriments: {
            create: {
              carbohydrates: input.nutriments.carbohydrates,
              energy: input.nutriments.energy,
              fat: input.nutriments.fat,
              proteins: input.nutriments.proteins,
              salt: input.nutriments.salt,
              saturatedFat: 0.0,
              sodium: input.nutriments.sodium,
              sugars: input.nutriments.sugars,
            }
          }
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
    }),

  getUserStatus: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.user.findFirst({
        where: { id: ctx.session.user.id },
        select: { hasAgreed: true }
      })
    }),
  agreeRules: protectedProcedure
    .mutation(async ({ ctx }) => {
      return await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { hasAgreed: true }
      });
    }),

  createFoodSubmission: protectedProcedure
    .input(z.object({
      name: z.string(),
      brand: z.string(),
      weight: z.number(),
      price: z.number(),
      image: z.string(),
      originCountry: z.string(),
      nutriScore: z.string(),
      ean: z.string(),
      ingredients: z.array(z.object({ id: z.number() }))
    })).mutation(async ({ ctx, input }) => {
      const product = await ctx.db.foodProduct.create({
        data: {
          name: input.name,
          image: input.image,
          brand: input.brand,
          weightG: input.weight,
          originCountry: input.originCountry,
          nutriScore: input.nutriScore,
          ean: input.ean,
          priceRON: input.price, ingredients: { connect: input.ingredients },
          isHidden: true
        }
      });

      return await ctx.db.foodSubmission.create({
        data: {
          createdById: ctx.session.user.id,
          foodProductId: product.id
        }
      });
    }),
  getFoodSubmissions: protectedProcedure
    .input(z.object({ approved: z.boolean().default(false) }))
    .query(async ({ ctx, input }) => {
      if (ctx.session.user.id != env.ADMIN_ID) {
        return await ctx.db.foodSubmission.findMany({
          where: { createdById: ctx.session.user.id },
          include: { food: true }
        });
      } else return await ctx.db.foodSubmission.findMany({
        include: { food: true },
        where: { food: { isHidden: !input.approved } }
      });
    }),
  getFoodSubmission: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.foodSubmission.findFirst({
        where: { createdById: ctx.session.user.id, id: input.id },
        include: { food: { include: { ingredients: true } } }
      });
    }),
  editFoodSubmission: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string(),
      brand: z.string(),
      weight: z.number(),
      price: z.number(),
      image: z.string(),
      originCountry: z.string(),
      nutriScore: z.string(),
      ean: z.string(),
      ingredients: z.array(z.object({ id: z.number() }))
    })).mutation(async ({ ctx, input }) => {
      return await ctx.db.foodProduct.update({
        where: { id: input.id },
        data: {
          name: input.name,
          image: input.image,
          brand: input.brand,
          weightG: input.weight,
          originCountry: input.originCountry,
          nutriScore: input.nutriScore,
          ean: input.ean,
          priceRON: input.price, ingredients: { connect: input.ingredients },
          isHidden: true
        }
      });
    }),
  approveFoodSubmission: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.foodProduct.update({
        where: { id: input.id },
        data: { isHidden: false }
      });
    }),
  denyFoodSubmission: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.foodProduct.update({
        where: { id: input.id },
        data: { isHidden: true }
      });
    }),
  deleteFoodSubmission: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const submission = await ctx.db.foodSubmission.delete({
        where: { id: input.id },
        include: { food: true }
      });

      await ctx.db.foodProduct.delete({
        where: { id: submission.food.id }
      })

      return submission;
    }),
});
