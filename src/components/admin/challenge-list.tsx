"use client";

import { type Challenges } from "@prisma/client";
import { type User } from "next-auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Clipboard } from "lucide-react";

export default function ChallengeList({
  challenges,
  isMilestone,
  totalUsers,
}: {
  challenges: (Challenges & { doneBy: User[] })[];
  isMilestone: boolean;
  totalUsers: number;
}) {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deleteChallenge = api.challenge.delete.useMutation({
    onSuccess: (data: Challenges) => {
      toast(`Deleted challenge "${data.title}"!`);
      router.refresh();
    },
  });

  const goodChallenges = challenges.filter((c) => c.isMilestone == isMilestone);

  return (
    <div>
      <h1 className="border-t-2 py-2 text-3xl font-bold">
        {isMilestone ? "Milestones" : "Challenges"}
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden md:table-cell">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead className="hidden md:table-cell">
              Completition Message
            </TableHead>
            <TableHead className="hidden md:table-cell">Earned by</TableHead>
            <TableHead>Points awarded</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goodChallenges.map((challenge) => (
            <TableRow key={challenge.id}>
              <TableCell className="hidden md:table-cell">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size={"icon"}
                        title={"Copy to clipboard"}
                        onClick={() => {
                          void navigator.clipboard
                            .writeText(challenge.id)
                            .then(() => {
                              toast("ID copied to clipboard!");
                            });
                        }}
                      >
                        <Clipboard />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to copy ID</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{challenge.title}</TableCell>
              <TableCell className="hidden md:table-cell">
                {challenge.description.substring(0, 25)}...
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {challenge.completionMsg.substring(0, 25)}...
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {challenge.doneBy.length} users (
                {(challenge.doneBy.length / totalUsers) * 100}%)
              </TableCell>
              <TableCell>{challenge.value} points</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
