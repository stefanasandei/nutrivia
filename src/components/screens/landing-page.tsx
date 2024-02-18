import Link from "next/link";

import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Learn more about health and food here!
        </h1>
      </div>
      <div className="flex gap-4">
        <Link href={siteConfig.links.login} className={buttonVariants()}>
          Join now
        </Link>
        <Link
          href={siteConfig.links.about}
          className={buttonVariants({ variant: "outline" })}
        >
          Learn more
        </Link>
      </div>
    </section>
  );
}
