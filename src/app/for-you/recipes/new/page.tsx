import { NewRecipe } from "@/components/screens/new-recipe";
import { api } from "@/trpc/server";

export default async function NewRecipePage() {
  const products = await api.admin.getFoodProducts.query();

  return <NewRecipe products={products} />;
}
