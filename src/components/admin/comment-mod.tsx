"use client";

import { type User, type Comment } from "@prisma/client";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { api } from "@/trpc/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CommentsModeration({
  comments,
}: {
  comments: ({ createdBy: User } & Comment)[];
}) {
  return (
    <div className="mt-3 border-t-2 border-border">
      <h1 className="text-3xl font-bold">Comments</h1>
      <p>Delete the comments which do not respect the Community Guidelines.</p>
      <div className="my-3 flex flex-col gap-3">
        {comments.map((com) => (
          <AdminCommentPreview comment={com} key={com.id} />
        ))}
      </div>
    </div>
  );
}

const AdminCommentPreview = ({
  comment,
}: {
  comment: { createdBy: User } & Comment;
}) => {
  const router = useRouter();
  const deleteComment = api.post.deleteComment.useMutation({
    onSuccess: () => {
      toast("Comment deleted!");
      router.refresh();
    },
  });

  return (
    <Card className="">
      <CardHeader className="mx-3 flex flex-row items-center justify-between">
        <div>
          <p className="text-xl">{comment.body}</p>
          <p>Posted by {comment.createdBy.name}</p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size={"icon"} title="Delete comment">
              <Icons.delete />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                comment.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  deleteComment.mutate({
                    id: comment.id,
                  })
                }
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
    </Card>
  );
};
