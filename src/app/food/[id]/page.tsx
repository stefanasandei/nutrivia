import FoodProductPage from "@/components/screens/product-page";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id);
  if (Number.isNaN(id)) notFound();

  const session = await getServerAuthSession();

  const food = await api.admin.findFoodProduct.query({
    id: id,
  });

  if (food == null) notFound();

  const user = await api.user.get.query();

  const points = await api.challenge.getUserPoints.query({
    userId: user!.id,
  });

  const comments = await api.admin.getFoodComments.query({
    id: food.id,
  });

  return (
    <section className="container flex flex-col">
      <FoodProductPage
        food={{
          ...food,
          nutriments: food.nutriments!,
        }}
        points={points}
        comments={comments?.comments ?? []}
        user={session == null ? null : user}
      />
    </section>
  );
}
