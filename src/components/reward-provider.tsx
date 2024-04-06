import { api } from "@/trpc/server";
import RewardPopup from "./reward-popup";

export default async function RewardProvider() {
  const challenge = await api.challenge.getQueued.query();

  if (challenge == null) return <></>;

  return <RewardPopup challenge={challenge.challenge} />;
}
