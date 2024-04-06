"use client";

import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Button, buttonVariants } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function LandingPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Make better informed decisions
        </h1>
        <p>
          Nutrivia is a web app designed to help its user make better decision
          regarding the food products they buy.
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={async () => await signIn()}>Join now</Button>
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
