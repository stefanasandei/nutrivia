import { pages as adminPages } from "@/components/admin/panel";
import { Sidebar } from "@/components/sidebar";
import { env } from "@/env";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session || session.user.id != env.ADMIN_ID) redirect("/");

  return (
    <div className="flex h-full w-full flex-1 flex-row md:grid md:grid-cols-6">
      <div className="w-10 md:col-span-1 md:w-full">
        <Sidebar
          title={"Admin panel"}
          items={adminPages}
          className="fixed z-50 h-full w-fit bg-background md:w-[18vw]"
        />
      </div>
      <div className="w-full flex-1 md:col-span-5">{children}</div>
    </div>
  );
}

/*
when complete challenge add it to the user array 
and add it to a quque
queue with recently completed challenges
provider at top level
on each page fetch queue and check for current user
*/
