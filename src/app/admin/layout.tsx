import AdminNavPanel from "@/components/admin/panel";
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
    <div className="grid h-full w-full flex-1 grid-cols-6">
      <div className="col-span-1 hidden w-full lg:flex">
        <div className="fixed h-full bg-accent/40 pr-7">
          <AdminNavPanel />
        </div>
      </div>
      <div className="col-span-5 w-full">{children}</div>
    </div>
  );
}
