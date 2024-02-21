import { Icons } from "@/components/icons";
import FoodProductPage from "@/components/screens/product-page";
import { buttonVariants } from "@/components/ui/button";
import { api } from "@/trpc/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SubmissionViewPage({
  params,
}: {
  params: { id: string };
}) {
  const submission = await api.admin.getFoodSubmission.query({
    id: parseInt(params.id),
  });
  if (!submission) notFound();

  return (
    <section className="container flex flex-col">
      <FoodProductPage food={submission.food} comments={[]} user={null} />
      <div className="ml-7 flex flex-row gap-4 pb-8">
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
    </section>
  );
}
