/* eslint-disable @next/next/no-img-element */
import { type Comment } from "@prisma/client";
import { type User } from "next-auth";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function CommentPreview({
  comment,
}: {
  comment: {
    createdBy: User;
  } & Comment;
}) {
  return (
    <div className="my-3 flex w-full flex-row gap-2">
      <img
        src={comment.createdBy.image!}
        className="m-1 h-12 w-12 rounded-md"
        alt="profile picture"
      />
      <div className="flex flex-col gap-1">
        <p className="font-thin text-zinc-300">
          <span>{comment.createdBy.name}</span>
          {" • "}
          {dayjs(comment.createdAt).fromNow()}
        </p>
        <h1 className="text-xl">{comment.body}</h1>
      </div>
    </div>
  );
}
