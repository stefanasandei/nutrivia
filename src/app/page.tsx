import { getServerAuthSession } from "@/server/auth";
import LandingPage from "@/components/screens/landing-page";

export default async function IndexPage() {
  const session = await getServerAuthSession();
  if (!session) return LandingPage();

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          lmao
        </h1>
      </div>
      <div className="flex gap-4"></div>
    </section>
  );
}
