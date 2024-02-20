/* eslint-disable @next/next/no-img-element */
import ForumWritePrompt from "@/components/forum-write-prompt";
import { Icons } from "@/components/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { type User, type Post } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default async function ForumPage() {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  const latestPosts = await api.post.getLatest.query();
  const bestPosts = await api.post.getLatest.query();

  return (
    <section className="container grid items-center gap-6 pb-8 pt-5 sm:pt-0">
      <div>
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
            <ForumWritePrompt />
          </div>
          <div className="">
            <TabsContent value="best">
              <div className="flex flex-col gap-4">
                {bestPosts.map((post) => (
                  <PostPreview key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="new">
              <div className="flex flex-col gap-4">
                {latestPosts.map((post) => (
                  <PostPreview key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
}

function PostPreview({ post }: { post: { createdBy: User } & Post }) {
  return (
    <Card className="flex w-full flex-col transition hover:cursor-pointer hover:bg-secondary/30">
      <CardHeader className="flex flex-row items-start justify-between p-3">
        <div>
          <p>Posted by {post.createdBy.name}</p>
          <CardTitle>{post.title}</CardTitle>
        </div>
        <Button size={"icon"} variant={"ghost"}>
          <Icons.options />
        </Button>
      </CardHeader>

      <CardFooter className="flex w-full flex-col items-start justify-between p-3 sm:flex-row sm:items-end">
        <div className="flex flex-row gap-3">
          <Link className={buttonVariants({ variant: "secondary" })} href="">
            Read more
          </Link>
          <Button variant={"secondary"} size={"icon"}>
            <Icons.like />
          </Button>
        </div>
        {post.image && (
          <div
            className="hidden aspect-square h-32 w-32 rounded-lg bg-cover bg-center sm:flex"
            style={{ backgroundImage: `url(${post.image})` }}
          />
        )}
      </CardFooter>
    </Card>
  );
}
