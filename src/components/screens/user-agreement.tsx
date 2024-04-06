"use client";

import { type User } from "next-auth";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MILESTONES } from "@/lib/milestones";

export default function UserAgreement({}: { user: User }) {
  const router = useRouter();

  const completeChallenge = api.challenge.complete.useMutation({
    onSuccess() {
      router.refresh();
    },
  });

  const agree = api.admin.agreeRules.useMutation({
    onSuccess: async () => {
      toast("Community Guidelines accepted!");

      await completeChallenge.mutateAsync({
        challengeId: MILESTONES.JoinForum,
      });

      router.push("/forum");
    },
  });

  return <Button onClick={() => agree.mutate()}>Agree</Button>;
}
