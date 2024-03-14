import SubmissionPreview from "@/components/admin/submission-preview";
import { buttonVariants } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ContributePage() {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  const submissions = await api.admin.getFoodSubmissions.query({});

  return (
    <section className="container grid items-center gap-6 pb-8 pt-3">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Contribute
        </h1>
        <p>
          You can contribute to our collection of food products by adding new
          food records.
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
