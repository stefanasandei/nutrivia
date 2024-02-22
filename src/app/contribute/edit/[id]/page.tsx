import EditFoodSubmissionForm from "@/components/admin/edit-submission";
import { api } from "@/trpc/server";
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

  const rawFood = await api.admin.getRawFoodProducts.query();

  return (
    <section className="container grid items-center gap-6 pb-8 pt-3">
      <EditFoodSubmissionForm submission={submission} rawFood={rawFood} />
    </section>
  );
}
