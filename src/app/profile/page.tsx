import EditProfileForm from "@/components/screens/edit-profile";
import { ThemeToggle } from "@/components/theme-toggle";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  return (
    <section className="container grid items-center gap-6 pb-8 pt-3">
      <div className="flex flex-row content-center items-start justify-between gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Edit your profile
        </h1>
        <ThemeToggle />
      </div>
      <div className="flex gap-4">
        <EditProfileForm user={session.user} />
      </div>
    </section>
  );
}
