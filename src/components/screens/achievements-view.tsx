import { type Challenges } from "@prisma/client";

export default function AchievementsView({
  challenges,
}: {
  challenges: Challenges[];
}) {
  return (
    <div>
      <p className="mb-3 text-2xl font-bold">Achievements</p>
      <p>{challenges.length} challenges solved</p>
    </div>
  );
}
