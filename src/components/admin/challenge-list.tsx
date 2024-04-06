"use client";

import { type FoodProduct, type Challenges } from "@prisma/client";
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

export default function ChallengeList({
  challenges,
  isMilestone,
}: {
  challenges: (Challenges & { doneBy: User[] })[];
  isMilestone: boolean;
}) {
  const router = useRouter();

  const deleteFood = api.admin.deleteFood.useMutation({
    onSuccess: (data: FoodProduct) => {
      toast(`Deleted food item "${data.name}"!`);
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
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Solved by</TableHead>
            <TableHead>Points awarded</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goodChallenges.map((challenge) => (
            <TableRow key={challenge.id}>
              <TableCell>{challenge.title}</TableCell>
              <TableCell>{challenge.description.substring(0, 25)}...</TableCell>
              <TableCell>{challenge.doneBy.length} users</TableCell>
              <TableCell>{challenge.value} points</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
