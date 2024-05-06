/* eslint-disable @next/next/no-img-element */
"use client";

import { siteConfig } from "@/config/site";
import { MainNav } from "@/components/main-nav";
import { buttonVariants } from "@/components/ui/button";
import { type Session } from "next-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { type User } from "@prisma/client";

export function SiteHeader({
  userMetadata,
  userPoints,
  session,
  isAdmin,
}: {
  userMetadata: User | null;
  userPoints: number;
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
            {session ? (
              <Link
                href={"/profile"}
                // className={buttonVariants()}
                onClick={async () => {
                  router.push("/profile");
                }}
              >
                <div className="flex flex-row items-center gap-4 overflow-hidden rounded-md border bg-card pl-2 transition-all hover:bg-secondary/50">
                  <div className="flex flex-col">
                    <p>{userMetadata?.name}</p>
                    <p className="font-semibold">{userPoints} points</p>
                  </div>
                  {userMetadata?.image && (
                    <img
                      src={userMetadata?.image}
                      alt="profile picture"
                      className="size-12"
                    />
                  )}
                </div>
              </Link>
            ) : (
              <Link
                href={""}
                className={buttonVariants()}
                onClick={async () => {
                  await signIn();
                }}
              >
                {"Sign in"}
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
