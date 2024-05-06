"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { type User, type Post } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "../icons";
import { api } from "@/trpc/react";
import { type User as AuthUser } from "next-auth";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

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
    <Card className="flex w-full flex-row transition hover:cursor-pointer hover:bg-secondary/30">
      <div
        onClick={() => router.push(`/forum/${post.id}`)}
        className="flex flex-1 flex-col"
      >
        <div className="flex flex-row items-start justify-between p-3">
          <div>
            <div className="flex flex-row gap-1">
              <p>
                Posted by{" "}
                <Link
                  className="hover:cursor-pointer hover:underline"
                  href={`/profile/@${post.createdBy.name}`}
                >
                  {post.createdBy.name}
                </Link>
              </p>
              <span className="font-normal">{` · ${dayjs(
                post.createdAt,
              ).fromNow()}`}</span>
            </div>
            <CardTitle>{post.title}</CardTitle>
          </div>
        </div>

        <div className="flex w-full flex-col items-start justify-between p-3 sm:flex-row sm:items-end">
          <div className="flex flex-row items-center gap-3">
            <p>{post.likedBy.length} likes</p>
            <Button
              variant={"secondary"}
              size={"icon"}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                likePost.mutate({ id: post.id });
              }}
            >
              <Icons.like
                fill={post.likedBy.includes(user.id) ? "white" : "none"}
              />
            </Button>
          </div>
        </div>
      </div>

      {post.image && (
        <div
          className="hidden aspect-square h-32 w-32 rounded-lg bg-cover bg-center sm:flex"
          style={{ backgroundImage: `url(${post.image})` }}
        />
      )}
    </Card>
  );
}
