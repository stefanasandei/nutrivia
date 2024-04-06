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

  return (
    <ResponsiveDialog
      triggerButton={<></>}
      title="Congrats!"
      description=""
      openState={[open, setOpen]}
    >
      <div>You completed {challenge.title}!</div>
      <Button
        onClick={() => {
          markSeen.mutate({ challengeId: challenge.id });
        }}
      >
        yup
      </Button>
    </ResponsiveDialog>
  );
}
