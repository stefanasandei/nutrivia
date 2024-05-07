"use server";

import { forYouPages } from "@/components/admin/panel";
import { Sidebar } from "@/components/sidebar";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

// needs work
export default async function ForYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  return (
    <div className="flex h-full w-full flex-1 flex-row md:grid md:grid-cols-6">
      <div className="md:col-span-1 md:w-full">
        <Sidebar
          title={"For you"}
          items={forYouPages}
          className="fixed z-50 h-full w-fit bg-background md:w-[16vw]"
        />
      </div>
      <div className="ml-[18vw] w-full flex-1 md:col-span-5 md:ml-0">
        {children}
      </div>
    </div>
  );
}
