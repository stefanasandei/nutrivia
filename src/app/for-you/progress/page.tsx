import MainBasketsPage from "@/components/screens/dashboard";
import { api } from "@/trpc/server";

export default async function ForYouProgressPage() {
  const baskets = await api.user.getBaskets.query();
  const food = await api.admin.getFoodProducts.query();

  const daily = await api.challenge.getDaily.query();
  const completed = await api.challenge.getCompleted.query();

  return (
    <MainBasketsPage
      completedChallenges={completed}
      baskets={baskets}
      dailyChallenge={daily!}
      food={food}
    />
  );
}
