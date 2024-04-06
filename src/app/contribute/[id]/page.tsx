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
      <FoodProductPage
        points={0}
        food={{ ...submission.food, nutriments: submission.food.nutriments! }}
        comments={[]}
        user={null}
        additionalControls={
          <div className="flex gap-3 md:flex-row">
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
        }
      />
    </section>
  );
}
