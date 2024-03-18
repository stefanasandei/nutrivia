"use client";

import { siteConfig } from "@/config/site";
import { MainNav } from "@/components/main-nav";
import { buttonVariants } from "@/components/ui/button";
import { type Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function SiteHeader({
  session,
  isAdmin,
}: {
  session: Session | null;
  isAdmin: boolean;
}) {
  const router = useRouter();

  const mainNav = !isAdmin
    ? siteConfig.mainNav
    : [
        ...siteConfig.mainNav,
        {
          title: "Admin",
          href: "/admin/foods",
        },
      ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav
          items={session != null ? mainNav : siteConfig.mainNavMarketing}
        />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link
              href={session ? "/profile" : ""}
              className={buttonVariants()}
              onClick={async () => {
                if (session) router.push("/profile");
                else await signIn("discord");
              }}
            >
              {session ? "Profile" : "Sign in"}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
