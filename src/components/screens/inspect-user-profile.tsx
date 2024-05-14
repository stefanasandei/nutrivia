/* eslint-disable @next/next/no-img-element */

"use client";

import { type Challenges, type User } from "@prisma/client";
import { Icons } from "@/components/icons";
import { AchievementPreview } from "@/components/screens/achievements-view";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { env } from "@/env";

export const InspectUserProfile = ({
  user,
  points,
  bio,
}: {
  user: { completedChallenges: Challenges[] } & User;
  points: number;
  bio: string;
}) => {
  const achievements = user.completedChallenges.filter(
    (c) => c.badgeURL.length > 1,
  );

  return (
    <section className="container grid items-center pb-8 pt-3">
      <div className="flex flex-col border-b-2 pb-4 md:flex-row">
        {user.image && (
          <img
            src={user.image}
            className="mb-6 size-52 rounded-xl sm:ml-6"
            alt={"profile picture"}
          />
        )}
        <div className="w-48" />
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-row gap-6">
            <h1 className="text-4xl font-bold">
              <Link href={`/profile/@${user.name}`} className="hover:underline">
                {user.name}
              </Link>
            </h1>
            <Button
              size={"icon"}
              title={"Copy to clipboard"}
              variant={"ghost"}
              onClick={() => {
                navigator.clipboard
                  .writeText(`${env.NEXT_PUBLIC_URL}/profile/@${user.name}`)
                  .then(() => {
                    toast("Profile URL copied to clipboard!");
                  })
                  .catch(() => {
                    console.error(
                      "Failed to copy profile url to clipboard. (how?)",
                    );
                  });
              }}
            >
              <Icons.copy />
            </Button>
          </div>
          <div className="mt-3 space-y-1">
            <p className="text-muted-foreground">Bio</p>
            <div
              className="prose dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: bio }}
            />
          </div>
          <div className="mt-3 space-y-1">
            <p className="text-muted-foreground">Stats</p>
            <ul className="ml-3 list-inside list-disc">
              <li className="list-item">
                <span className="font-bold">{points}</span> points
              </li>
              <li className="list-item">
                <span className="font-bold">{achievements.length}</span>{" "}
                achievements
              </li>
              <li className="list-item">
                <span className="font-bold">
                  {user.completedChallenges.length - achievements.length}
                </span>{" "}
                challenges completed
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <p className="mb-2 text-2xl font-bold">
          {achievements.length} Achievements completed
        </p>
        <div className="grid grid-flow-row grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {achievements.map((c) => (
            <AchievementPreview key={c.id} challenge={c} />
          ))}
        </div>
      </div>
    </section>
  );
};
