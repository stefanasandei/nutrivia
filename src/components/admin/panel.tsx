"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavPanel() {
  const path = usePathname();

  const pages = [
    {
      name: "Overview",
      href: "/admin",
    },
    {
      name: "Food Products",
      href: "/admin/foods",
    },
    {
      name: "Moderation",
      href: "/admin/moderation",
    },
    {
      name: "Submissions",
      href: "/admin/submissions",
    },
  ];

  return (
    <div className="fixed m-3 ml-5 hidden flex-col sm:flex">
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
                "flex h-10 w-full items-center rounded-lg p-2 transition " +
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
