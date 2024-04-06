/* eslint-disable @next/next/no-img-element */
import { type Challenges } from "@prisma/client";

export default function AchievementsView({
  challenges,
}: {
  challenges: Challenges[];
}) {
  const badgedChallenges = challenges.filter((c) => c.badgeURL.length > 1);
  const boringChallenges = challenges.filter((c) => c.isMilestone == false);

  return (
    <div className="flex flex-col gap-3">
      <p className="mb-3 text-2xl">
        <span className="font-bold">Achievements</span>: {challenges.length}{" "}
        challenges solved
      </p>
      {/* <p className="text-xl">Milestones:</p> */}
      <div className="grid grid-flow-row grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {[...badgedChallenges].map((challenge) => (
          <AchievementPreview key={challenge.id} challenge={challenge} />
        ))}
      </div>
      {boringChallenges.length > 0 && (
        <>
          <p className="text-xl">Challanges completed:</p>
          <ul className="list ml-5 list-disc">
            {boringChallenges.map((c) => {
              return <li key={c.id}>{c.title}</li>;
            })}
          </ul>
        </>
      )}
    </div>
  );
}

const AchievementPreview = ({ challenge }: { challenge: Challenges }) => {
  return (
    <div className="col-span-1 flex flex-col items-center rounded-lg p-2 transition-all hover:bg-secondary/40">
      <img
        src={challenge.badgeURL}
        alt={"Profile badge"}
        width={500}
        height={500}
        className="size-40"
      />
      <p className="text-center text-xl font-semibold sm:text-2xl">
        {challenge.title}
      </p>
    </div>
  );
};
