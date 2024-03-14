"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { type FoodProduct, type FoodSubmission } from "@prisma/client";
import Link from "next/link";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Icons } from "@/components/icons";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);

export default function SubmissionPreview({
  submission,
  isAdmin,
}: {
  submission: { food: FoodProduct } & FoodSubmission;
  isAdmin?: boolean;
}) {
  const router = useRouter();

  const approveSubmissions = api.admin.approveFoodSubmission.useMutation({
    onSuccess: () => {
      toast("Approved! :)");
      router.refresh();
    },
  });

  const denySubmissions = api.admin.denyFoodSubmission.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <Card className="transition hover:cursor-pointer hover:bg-secondary/30">
      <div className="flex flex-row items-center justify-between">
        <Link href={`/contribute/${submission.id}`} className="w-full">
          <CardHeader>
            <CardTitle>
              {submission.food.name}
              {" • "}
              <span className="text-xl font-thin text-secondary-foreground">
                {dayjs(submission.createdAt).fromNow()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardFooter>
            <p>
              Pending review.{" "}
              <span className="hidden sm:inline-block">
                Click for more info.
              </span>
            </p>
          </CardFooter>
        </Link>
        {!isAdmin && (
          <div className="m-3 flex flex-col gap-4 pr-3">
            <Link
              href={`/contribute/edit/${submission.id}`}
              className={buttonVariants({ size: "icon", variant: "secondary" })}
            >
              <Icons.update />
            </Link>
            <Link
              href={`/contribute/delete/${submission.id}`}
              className={buttonVariants({ size: "icon", variant: "secondary" })}
            >
              <Icons.delete />
            </Link>
          </div>
        )}
        {isAdmin && (
          <div className="pr-3">
            {submission.food.isHidden && (
              <Button
                variant={"secondary"}
                size={"icon"}
                onClick={() =>
                  approveSubmissions.mutate({ id: submission.food.id })
                }
              >
                <Icons.approve />
              </Button>
            )}
            {!submission.food.isHidden && (
              <Button
                variant={"secondary"}
                size={"icon"}
                onClick={() =>
                  denySubmissions.mutate({ id: submission.food.id })
                }
              >
                <Icons.deny />
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
