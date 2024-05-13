import { SocialButton } from "@/components/social-btn";
import Link from "next/link";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Index() {
  const session = await getServerAuthSession();
  if (session) redirect("/");

  return (
    <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <div className="container flex flex-col items-center gap-4 text-center md:max-w-[64rem]">
        <div className="flex items-center justify-center md:-mt-16">
          <div className="mx-auto grid gap-6 md:w-[350px]">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Get started</h1>
              <p className="text-balance text-secondary-foreground">
                Login with one of the provider below.
              </p>
            </div>
            <div className="grid gap-4">
              <SocialButton provider={"discord"} label="Login with Discord" />
              <SocialButton provider={"google"} label="Login with Google" />
              <SocialButton provider={"github"} label="Login with GitHub" />
            </div>
            <div className="mt-4 text-center text-sm">
              By logging in, you agree to our{" "}
              <Link href="#" className="underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
