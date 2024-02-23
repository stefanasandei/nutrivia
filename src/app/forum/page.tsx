import ForumWritePrompt from "@/components/forum-write-prompt";
import { Icons } from "@/components/icons";
import Notifications from "@/components/screens/notifications";
import PostPreview from "@/components/screens/post-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function ForumPage() {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  const latestPosts = await api.post.getLatest.query();
  const bestPosts = await api.post.getBest.query();
  const hasAgreed = await api.admin.getUserStatus.query();

  return (
    <section className="container grid items-center gap-6 pb-8 pt-5 sm:pt-0">
      <div>
        <Notifications />
        <Tabs defaultValue="new">
          <div className="flex w-full flex-row items-center justify-between rounded-md bg-secondary px-3 py-2 sm:my-3">
            <TabsList>
              <TabsTrigger value="best" className="flex flex-row gap-2">
                <Icons.best />
                Best
              </TabsTrigger>
              <TabsTrigger value="new" className="flex flex-row gap-2">
                <Icons.fire />
                New
              </TabsTrigger>
            </TabsList>
            <ForumWritePrompt
              user={session.user}
              agree={hasAgreed?.hasAgreed ?? false}
            />
          </div>
          <div className="">
            <TabsContent value="best">
              <div className="flex flex-col gap-4">
                {bestPosts.map((post) => (
                  <PostPreview key={post.id} post={post} user={session.user} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="new">
              <div className="flex flex-col gap-4">
                {latestPosts.map((post) => (
                  <PostPreview key={post.id} post={post} user={session.user} />
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
