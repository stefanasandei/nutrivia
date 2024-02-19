import { getServerAuthSession } from "@/server/auth";
import LandingPage from "@/components/screens/landing-page";
import { api } from "@/trpc/server";
import FoodCard from "@/components/food-cart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export default async function IndexPage() {
  const session = await getServerAuthSession();
  if (!session) return LandingPage();

  const food = await api.admin.getFoodProducts.query();

  return (
    <section className="container grid items-center gap-6 pb-8 pt-3">
      <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Food Products
        </h1>
        <div className="flex flex-row gap-4">
          <Input
            className="w-full md:max-w-80"
            placeholder="Search for a product..."
          />
          <Button size={"icon"} variant={"outline"} className="w-16">
            <Icons.search />
          </Button>
        </div>
      </div>
      <div className="grid grid-flow-row grid-cols-1 justify-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {food.map((item) => (
          <FoodCard key={item.id} food={item} />
        ))}
      </div>
    </section>
  );
}
