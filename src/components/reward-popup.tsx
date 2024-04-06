"use client";

import { type Challenges } from "@prisma/client";
import ResponsiveDialog from "./responsive-dialog";
import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "./ui/button";

export default function RewardPopup({ challenge }: { challenge: Challenges }) {
  const [open, setOpen] = useState(true);

  const markSeen = api.challenge.markSeen.useMutation({
    onSuccess() {
      setOpen(false);
    },
  });

  const isMilestone = challenge.isMilestone;

  return (
    <ResponsiveDialog
      triggerButton={<></>}
      title={isMilestone ? "Milestone completed!" : "Challenge completed!"}
      description=""
      openState={[open, setOpen]}
    >
      <div className="flex h-full flex-col items-center justify-between">
        <div>
          <p className="text-3xl font-bold">✨ {challenge.title} ✨</p>
          <p className="mt-4 hidden sm:block">
            You hace succsessfully completed this challenge! Go to your profile
            to check your progress, and keep up the good work!
          </p>
        </div>
        <p className="text-xl">{challenge.completionMsg}</p>
        <Button
          className="w-full"
          onClick={() => {
            markSeen.mutate({ challengeId: challenge.id });
          }}
        >
          Okay
        </Button>
      </div>
    </ResponsiveDialog>
  );
}
