/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import AchievementsView from "@/components/screens/achievements-view";
import EditProfileForm from "@/components/screens/edit-profile";
import { buttonVariants } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  const user = await api.user.get.query();

  const points = await api.challenge.getUserPoints.query({
    userId: user!.id,
  });

  const food = await api.admin.getRawFoodProducts.query();
  const allergies = await api.admin.getAllergiesOfUser.query({
    uid: session.user.id,
  });

  return (
    <section className="container grid items-center gap-6 pb-8 pt-3">
      <div className="flex flex-row content-center items-start justify-between gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Edit your profile
        </h1>
        <div className="flex flex-row gap-2">
          <Link href="/api/auth/signout" className={buttonVariants()}>
            Sign out
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <EditProfileForm
          points={points}
          user={user!}
          allergies={allergies?.allergies ?? []}
          food={food}
        />
        <AchievementsView challenges={user?.completedChallenges!} />
      </div>
    </section>
  );
}
