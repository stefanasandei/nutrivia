"use client";

import { siteConfig } from "@/config/site";
import { MainNav } from "@/components/main-nav";
import { type Session } from "next-auth";
import { type User } from "@prisma/client";
import { ProfileButton } from "./profile-button";

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
      <div className="container flex h-16 items-center justify-between space-x-4 sm:space-x-0">
        <MainNav
          items={session != null ? mainNav : siteConfig.mainNavMarketing}
        />
        <ProfileButton user={userMetadata} points={userPoints} />
      </div>
    </header>
  );
}
