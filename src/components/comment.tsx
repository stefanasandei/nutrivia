/* eslint-disable @next/next/no-img-element */
import { type Comment } from "@prisma/client";
import { type User } from "next-auth";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);

export default function CommentPreview({
  comment,
}: {
  comment: {
    createdBy: User;
  } & Comment;
}) {
  return (
    <div className="my-3 flex w-full flex-row gap-2 text-foreground">
      <img
        src={comment.createdBy.image!}
        className="m-1 h-12 w-12 rounded-md"
        alt="profile picture"
      />
      <div className="flex flex-col gap-1">
        <p className="font-thin dark:text-secondary-foreground">
          <Link
            className="hover:cursor-pointer hover:underline"
            href={`/profile/@${comment.createdBy.name}`}
          >
            {comment.createdBy.name}
          </Link>
          {" • "}
          {dayjs(comment.createdAt).fromNow()}
        </p>
        <h1 className="text-xl">{comment.body}</h1>
      </div>
    </div>
  );
}
