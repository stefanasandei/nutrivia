import AddFoodProductForm from "@/components/admin/add-food";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function ContributePage() {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  const rawFood = await api.admin.getRawFoodProducts.query();

  return (
    <section className="container grid items-center gap-6 pb-8 pt-3">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          New submissions
        </h1>
        <p>
          Contribute to our catalog by created a submission for a new food
          product record. Once you send this submission, it will be pending for
          verification.
        </p>
      </div>
      <div className="flex flex-col space-y-6">
        <AddFoodProductForm
          isHidden={true}
          user={session.user}
          rawFood={rawFood}
        />
      </div>
    </section>
  );
}
