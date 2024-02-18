import Link from "next/link";
import { buttonVariants } from "../ui/button";

export default function AdminNavPanel() {
  const pages = [
    {
      name: "Overview",
      href: "/admin",
    },
    {
      name: "Aliments",
      href: "/admin/aliments",
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
    <div className="m-3 ml-5 hidden flex-col sm:flex">
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
                "flex h-10 w-full items-center rounded-lg p-2 transition hover:bg-accent"
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
