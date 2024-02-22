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
    <div className="grid h-full w-full flex-1 md:grid-cols-6">
      <div className="hidden w-full md:col-span-1 md:flex">
        <Sidebar
          items={adminPages}
          className="fixed max-w-[20vw] md:max-w-[18vw]"
        />
      </div>
      <div className="w-full md:col-span-5">{children}</div>
    </div>
  );
}
