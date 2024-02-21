import { buttonVariants } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { type FoodProduct, type FoodSubmission } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Icons } from "@/components/icons";

dayjs.extend(relativeTime);

export default async function ContributePage() {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  const submissions = await api.admin.getFoodSubmissions.query();

  return (
    <section className="container grid items-center gap-6 pb-8 pt-3">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Contribute
        </h1>
        <p>
          You can contribute to our collection of food products by adding a new
          food record.
        </p>
      </div>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-row justify-between">
          <h2 className="text-2xl font-bold">Your submissions</h2>
          <Link href="/contribute/new" className={buttonVariants()}>
            New submission
          </Link>
        </div>
        <div>
          {submissions.map((sub) => (
            <SubmissionPreview submission={sub} key={sub.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SubmissionPreview({
  submission,
}: {
  submission: { food: FoodProduct } & FoodSubmission;
}) {
  return (
    <Card className="transition hover:cursor-pointer hover:bg-secondary/30">
      <div className="flex flex-row justify-between">
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
        <div className="m-3 flex flex-col gap-4">
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
      </div>
    </Card>
  );
}
