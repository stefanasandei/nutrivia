import { InspectUserProfile } from "@/components/screens/inspect-user-profile";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerAuthSession();
  const user = await api.user.get.query();

  if (!session || !user) redirect("/");

  const points = await api.challenge.getUserPoints.query({
    userId: user.id,
  });

  return <InspectUserProfile user={user} points={points} />;
}
