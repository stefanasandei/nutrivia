import { CreateNewBasket } from "@/components/screens/new-basket";
import { api } from "@/trpc/server";

export default async function NewBasket() {
  const food = await api.admin.getFoodProducts.query();
  const user = await api.user.get.query();

  return <CreateNewBasket food={food} user={user!} />;
}
