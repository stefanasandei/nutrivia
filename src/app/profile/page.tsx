import { getServerAuthSession } from "@/server/auth";

export default async function ProfilePage() {
  const session = await getServerAuthSession();

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          profile
        </h1>
      </div>
      <div className="flex gap-4">
        <h1>ur name: {session?.user.name}</h1>
      </div>
    </section>
  );
}
