"use client";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type User, type Post } from "@prisma/client";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "../icons";
import { api } from "@/trpc/react";
import { type User as AuthUser } from "next-auth";
import { useRouter } from "next/navigation";

export default function PostPreview({
  post,
  user,
}: {
  post: { createdBy: User } & Post;
  user: AuthUser;
}) {
  const router = useRouter();

  const likePost = api.post.likePost.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <Card className="flex w-full flex-col transition hover:cursor-pointer hover:bg-secondary/30">
      <CardHeader className="flex flex-row items-start justify-between p-3">
        <div>
          <p>
            Posted by{" "}
            <Link
              className="hover:cursor-pointer hover:underline"
              href={`/profile/@${post.createdBy.name}`}
            >
              {post.createdBy.name}
            </Link>
          </p>
          <CardTitle>{post.title}</CardTitle>
        </div>
        <Button size={"icon"} variant={"ghost"}>
          {/* <Icons.options /> */}
          {post.likedBy.length} likes
        </Button>
      </CardHeader>

      <CardFooter className="flex w-full flex-col items-start justify-between p-3 sm:flex-row sm:items-end">
        <div className="flex flex-row gap-3">
          <Link
            className={buttonVariants({ variant: "secondary" })}
            href={`/forum/${post.id}`}
          >
            Read more
          </Link>
          <Button
            variant={"secondary"}
            size={"icon"}
            onClick={() => likePost.mutate({ id: post.id })}
          >
            <Icons.like
              fill={post.likedBy.includes(user.id) ? "white" : "none"}
            />
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
