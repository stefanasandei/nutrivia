import { api } from "@/trpc/server";
import CommentsModeration from "@/components/admin/comment-mod";

export default async function ModerationPage() {
  const comments = await api.post.getComments.query();

  return (
    <section className="m-3 ml-7 h-full w-full gap-6">
      <div className="flex flex-row content-center items-start justify-between gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Moderation Page
        </h1>
      </div>
      <div className="space-y-3">
        <CommentsModeration comments={comments!} />
      </div>
    </section>
  );
}
