import FullPostPage from "@/components/screens/full-post";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function PostPage({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();

  const post = await api.post.findById.query({
    id: parseInt(params.id),
  });

  if (post == null) notFound();

  let challenge = undefined;
  if (post.challengeId != "") {
    challenge = await api.challenge.getById.query({
      id: post.challengeId,
    });
  }

  return (
    <FullPostPage
      challenge={challenge ?? undefined}
      post={post}
      user={session == null ? null : session.user}
    />
  );
}
