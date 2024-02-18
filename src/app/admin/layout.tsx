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
    <div className="grid h-full w-full flex-1 grid-cols-5">
      <div className="col-span-1 h-full bg-accent/40">
        <AdminNavPanel />
      </div>
      <div className="col-span-4 w-full">{children}</div>
    </div>
  );
}
