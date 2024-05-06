"use client";

import { api } from "@/trpc/react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { CHALLENGES } from "@/lib/milestones";
import { type TrackedChallange } from "@prisma/client";

export const DebugChallenge = ({
  completedChallenges,
}: {
  completedChallenges: TrackedChallange[];
}) => {
  const router = useRouter();

  const completed =
    completedChallenges.filter((c) => c.challengesId == CHALLENGES.Debug)
      .length > 0;

  const completeDebug = api.challenge.complete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const restartDebug = api.challenge.restart.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  if (!completed)
    return (
      <Button
        variant={"secondary"}
        onClick={() => {
          completeDebug.mutate({ challengeId: CHALLENGES.Debug });
        }}
      >
        Complete test challenge
      </Button>
    );
  return (
    <Button
      variant={"secondary"}
      onClick={() => {
        restartDebug.mutate({ id: CHALLENGES.Debug });
      }}
    >
      Restart test challenge
    </Button>
  );
};
