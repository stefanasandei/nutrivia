import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import ChallengeList from "@/components/admin/challenge-list";
import AddChallengeForm from "@/components/admin/add-challenge";

export default async function FoodProductsPage() {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  const challenges = await api.challenge.get.query();
  const totalUsers = await api.admin.countUsers.query();

  return (
    <section className="container m-3 h-full w-full">
      <div className="flex flex-col content-center items-start justify-between gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Challenges & Milestones
        </h1>
        <p>Create and manage challenges and milestones.</p>
      </div>
      <div className="mt-5 flex w-full flex-col space-y-4">
        <AddChallengeForm isMilestone={true} />
        <ChallengeList
          challenges={challenges}
          totalUsers={totalUsers}
          isMilestone={true}
        />
        <AddChallengeForm isMilestone={false} />
        <ChallengeList
          challenges={challenges}
          totalUsers={totalUsers}
          isMilestone={false}
        />
      </div>
    </section>
  );
}
