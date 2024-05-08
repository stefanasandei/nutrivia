"use server";

import { forYouPages } from "@/components/screens/for-you";
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
      <div className="w-10 md:col-span-1 md:w-full">
        <Sidebar
          title={"For you"}
          items={forYouPages}
          className="fixed z-50 w-fit bg-background md:w-[18vw]"
        />
      </div>
      <div className="w-full flex-1 md:col-span-5">{children}</div>
    </div>
  );
}
