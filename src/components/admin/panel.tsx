"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MailSearch, Scale, Utensils, VeganIcon } from "lucide-react";

export const pages = [
  // {
  //   icon: PieChart,
  //   name: "Overview",
  //   href: "/admin",
  // },
  {
    icon: Utensils,
    name: "Food Products",
    href: "/admin/foods",
  },
  {
    icon: Scale,
    name: "Moderation",
    href: "/admin/moderation",
  },
  {
    icon: MailSearch,
    name: "Submissions",
    href: "/admin/submissions",
  },
  {
    icon: VeganIcon,
    name: "Challenges",
    href: "/admin/challenges",
  },
];

// shouldn't be here, but it has to be
// exported from a "use client" component.
export const forYouPages = [
  {
    icon: Utensils,
    name: "Food baskets",
    href: "/dashboard",
  },
  {
    icon: Utensils,
    name: "Progress",
    href: "#",
  },
  {
    icon: Utensils,
    name: "Recipes",
    href: "#",
  },
];

export default function AdminNavPanel() {
  const path = usePathname();

  return (
    <div className="my-3 ml-5 flex w-full flex-1 flex-col">
      <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        Admin Panel
      </h1>
      <div className="mt-5 flex flex-col space-y-5">
        {pages.map((page) => {
          return (
            <Link
              href={page.href}
              key={page.href}
              className={
                "flex h-10 items-center rounded-lg p-2 transition " +
                (path.endsWith(page.href) ? "bg-accent" : "hover:bg-accent")
              }
            >
              {page.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
