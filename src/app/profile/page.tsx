import { InspectUserProfile } from "@/components/screens/inspect-user-profile";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { marked } from "marked";
import { redirect } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";

export default async function ProfilePage() {
  const session = await getServerAuthSession();
  const user = await api.user.get.query();

  if (!session || !user) redirect("/");

  const points = await api.challenge.getUserPoints.query({
    userId: user.id,
  });

  const bio = await (async () => {
    const rendered = await marked(user.bio);
    const safe = DOMPurify.sanitize(rendered);
    return safe;
  })();

  return <InspectUserProfile user={user} points={points} bio={bio} />;
}
