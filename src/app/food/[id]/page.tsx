import FoodProductPage from "@/components/screens/product-page";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerAuthSession();

  const food = await api.admin.findFoodProduct.query({
    id: parseInt(params.id),
  });

  if (food == null) notFound();

  const comments = await api.admin.getFoodComments.query({
    id: food.id,
  });

  return (
    <FoodProductPage
      food={food}
      comments={comments?.comments ?? []}
      user={session == null ? null : session.user}
    />
  );
}
