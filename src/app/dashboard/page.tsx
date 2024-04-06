import MainBasketsPage from "@/components/screens/dashboard";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function BasketPage() {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  const baskets = await api.user.getBaskets.query();
  const food = await api.admin.getFoodProducts.query();

  return <MainBasketsPage baskets={baskets} food={food} />;
}
