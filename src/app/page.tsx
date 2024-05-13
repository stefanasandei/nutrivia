import { getServerAuthSession } from "@/server/auth";
import LandingPage from "@/components/screens/landing-page";
import { api } from "@/trpc/server";
import ProductCatalog from "@/components/screens/product-catalog";

export default async function IndexPage() {
  const session = await getServerAuthSession();
  if (!session)
    return (
        <LandingPage />
    );

  const food = await api.admin.getFoodProducts.query();

  return <ProductCatalog user={session.user} food={food} />;
}
