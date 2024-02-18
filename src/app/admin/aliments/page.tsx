import AddAlimentForm from "@/components/admin/add-aliment";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function AlimentsPage() {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  const food = await api.admin.getAliments.query();

  return (
    <section className="container m-3 h-full w-full">
      <div className="flex flex-col content-center items-start justify-between gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Aliments Page
        </h1>
        <p>
          Here you can view, edit and create aliment records. A list of all
          aliments: {JSON.stringify(food)}
        </p>
      </div>
      <div className="mt-5 w-full">
        <AddAlimentForm user={session.user} />
      </div>
    </section>
  );
}
