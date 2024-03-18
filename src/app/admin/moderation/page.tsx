import { api } from "@/trpc/server";
import CommentsModeration from "@/components/admin/comment-mod";

export default async function ModerationPage() {
  const comments = await api.post.getComments.query();

  return (
    <section className="container m-3 h-full w-full">
      <div className="flex flex-col content-center items-start justify-between gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Moderation Page
        </h1>
        <p>
          Here you can read & delete content posted by the users on the forum.
        </p>
      </div>
      <div className="mt-5 flex w-full flex-col space-y-4">
        <CommentsModeration comments={comments!} />
      </div>
    </section>
  );
}
