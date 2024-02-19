import AddFoodProductForm from "@/components/admin/add-food";
import RawFoodList from "@/components/admin/raw-food-list";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function FoodProductsPage() {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  const rawFood = await api.admin.getRawFoodProducts.query();

  return (
    <section className="container m-3 h-full w-full">
      <div className="flex flex-col content-center items-start justify-between gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Food Products Page
        </h1>
        <p>Here you can view, edit and create food product records.</p>
      </div>
      <div className="mt-5 flex w-full flex-col space-y-4">
        <AddFoodProductForm user={session.user} />
        <RawFoodList user={session.user} rawFood={rawFood} />
      </div>
    </section>
  );
}
