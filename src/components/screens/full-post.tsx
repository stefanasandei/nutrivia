"use client";

import { type Comment, type Post } from "@prisma/client";
import { type User } from "next-auth";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import CommentPreview from "../comment";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.extend(relativeTime);

export default function FullPostPage({
  user,
  post,
}: {
  post: { comments: ({ createdBy: User } & Comment)[]; createdBy: User } & Post;
  user: User | null;
}) {
  const router = useRouter();

  const addComment = api.post.addComment.useMutation({
    onSuccess: () => {
      toast("Comment submitted");
      router.refresh();
    },
  });

  const deleteComment = api.post.deleteComment.useMutation({
    onSuccess: () => {
      toast("Comment deleted");
      router.refresh();
    },
  });

  const [comment, setComment] = useState("");

  return (
    <section className="container grid items-center gap-6 pb-8 pt-3">
      <div className="row flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          {post.title}
        </h1>
        <p className="font-thin text-secondary-foreground">
          <span className="hidden sm:block">
            Post created by {post.createdBy.name},{" "}
            {dayjs(post.createdAt).fromNow()}
          </span>
          <span className="block sm:hidden">
            {post.createdBy.name}
            {" • "}
            {dayjs(post.createdAt).fromNow()}
          </span>
        </p>
      </div>
      <div className="flex flex-col items-start border-b-2 border-b-secondary pb-5">
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            width={250}
            height={250}
            className="mx-auto rounded-lg"
          />
        )}
        <p>{post.body}</p>
      </div>
      <div className="flex w-full flex-col gap-3">
        {user != null && (
          <div className="flex w-full flex-row gap-5">
            <Input
              placeholder="Write a comment here!"
              value={comment}
              onChange={(newValue) => setComment(newValue.target.value)}
            />
            <Button
              size={"icon"}
              onClick={() => {
                addComment.mutate({
                  id: post.id,
                  text: comment,
                });
                setComment("");
              }}
            >
              <Icons.send />
            </Button>
          </div>
        )}
        <div>
          {post.comments.map((comment) => {
            return (
              <div
                key={comment.id}
                className="flex w-full flex-row items-center justify-center"
              >
                <CommentPreview comment={comment} />
                {user?.id == comment.createdById && (
                  <Button
                    size={"icon"}
                    onClick={() => {
                      deleteComment.mutate({ id: comment.id });
                    }}
                  >
                    <Icons.delete />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
