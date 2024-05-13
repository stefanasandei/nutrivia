"use client";

import Link from "next/link";

import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <div className="container flex flex-col items-center gap-4 text-center md:max-w-[64rem]">
        <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
          Empowering healthier choices
        </h1>
        <p className="leading-normal text-muted-foreground sm:text-xl sm:leading-8 md:max-w-[42rem]">
          Nutrivia is a web app designed to help its user make better decision
          regarding the food products they buy
        </p>
        <div className="flex gap-4 md:flex-row">
          <Link href="/login" className={buttonVariants()}>
            Join now
          </Link>
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "outline" })}
          >
            GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}
