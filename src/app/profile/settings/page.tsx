import EditProfileForm from "@/components/screens/edit-profile";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function ProfileSettings() {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  const user = await api.user.get.query();
  if (!user) return <></>;

  const food = await api.admin.getRawFoodProducts.query();
  const allergies = await api.admin.getAllergiesOfUser.query({
    uid: session.user.id,
  });

  return (
    <section className="container grid items-center gap-6 pb-8 pt-3">
      <EditProfileForm
        allergies={allergies?.allergies ?? []}
        food={food}
        user={user}
      />
    </section>
  );
}
