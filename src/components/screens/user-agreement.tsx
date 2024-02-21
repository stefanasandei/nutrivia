"use client";

import { type User } from "next-auth";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UserAgreement({}: { user: User }) {
  const router = useRouter();

  const agree = api.admin.agreeRules.useMutation({
    onSuccess: () => {
      toast("Community Guidelines accepted!");
      router.push("/forum");
    },
  });

  return <Button onClick={() => agree.mutate()}>Agree</Button>;
}
