/* eslint-disable @next/next/no-img-element */
import { InspectUserProfile } from "@/components/screens/inspect-user-profile";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username.split("%40")[1]; // remove "@"
  if (!username) return notFound();

  const user = await api.user.findByUsername.query({
    username: username,
  });
  if (!user) return notFound();

  const points = await api.challenge.getUserPoints.query({
    userId: user.id,
  });

  return <InspectUserProfile user={user} points={points} />;
}
