import SubmissionPreview from "@/components/admin/submission-preview";
import { api } from "@/trpc/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function SubmissionsPage() {
  const submissions = await api.admin.getFoodSubmissions.query({});
  const approvedSubmissions = await api.admin.getFoodSubmissions.query({
    approved: true,
  });

  return (
    <section className="container mt-3 h-full w-full gap-6 md:m-3">
      <div className="flex flex-col gap-4">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mx-auto flex w-full flex-row justify-between gap-3 md:max-w-[40vw]">
            <TabsTrigger value="pending" className="w-full">
              Pending
            </TabsTrigger>
            <TabsTrigger value="approved" className="w-full">
              Approved
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            {submissions.length == 0 && (
              <p className="mt-5 text-center text-xl">
                There are no submissions at the moment.
              </p>
            )}
            {submissions.map((submission) => (
              <SubmissionPreview
                isAdmin={true}
                submission={submission}
                key={submission.id}
              />
            ))}
          </TabsContent>
          <TabsContent value="approved">
            {approvedSubmissions.length == 0 && (
              <p className="mt-5 text-center text-xl">
                There are no approved submissions yet.
              </p>
            )}
            {approvedSubmissions.map((submission) => (
              <SubmissionPreview
                isAdmin={true}
                submission={submission}
                key={submission.id}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
