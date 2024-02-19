import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function BasketPage() {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  return (
    <section className="container grid items-center gap-6 pb-8 pt-3">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Your Basket
        </h1>
      </div>
      <div className="flex gap-4"></div>
    </section>
  );
}
