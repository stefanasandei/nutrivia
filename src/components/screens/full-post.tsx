"use client";

import { type Challenges, type Comment, type Post } from "@prisma/client";
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
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

dayjs.extend(relativeTime);

export default function FullPostPage({
  user,
  post,
  challenge,
}: {
  post: { comments: ({ createdBy: User } & Comment)[]; createdBy: User } & Post;
  user: User | null;
  challenge?: Challenges;
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

  const deletePost = api.post.deletePost.useMutation({
    onSuccess: () => {
      toast("Post deleted");
      router.push("/forum");
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
            Post created by{" "}
            <Link
              className="hover:cursor-pointer hover:underline"
              href={`/profile/@${post.createdBy.name}`}
            >
              {post.createdBy.name}
            </Link>
            , {dayjs(post.createdAt).fromNow()}
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
        {challenge != undefined && (
          <Alert className="my-3 ring-2 ring-secondary transition-all hover:cursor-pointer hover:bg-secondary">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Community Challenge: {challenge.title}</AlertTitle>
            <AlertDescription>{challenge.description}</AlertDescription>
          </Alert>
        )}
        <p>{post.body}</p>
        {post.createdById === user?.id && (
          <div className="mt-4 flex flex-row gap-3">
            <Button
              size={"icon"}
              onClick={() => deletePost.mutate({ id: post.id })}
            >
              <Icons.delete />
            </Button>
          </div>
        )}
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
