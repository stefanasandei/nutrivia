"use client";

import { siteConfig } from "@/config/site";
import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import { type Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

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
          href: "/admin",
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
            <Button
              onClick={async () => {
                if (session) router.push("/profile");
                else await signIn("discord");
              }}
            >
              {session ? "Profile" : "Sign in"}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
