"use client";

import { cn } from "@/lib/utils";
import { type Icons } from "./icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    icon: typeof Icons.add;
    name: string;
    href: string;
  }[];
}

export function Sidebar({ className, items }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 hidden px-4 text-lg font-semibold tracking-tight md:block">
            Admin Panel
          </h2>
          <div className="flex flex-col gap-2 md:w-full">
            {items.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({
                      variant: pathname.endsWith(item.href)
                        ? "secondary"
                        : "ghost",
                    }),
                    "hidden justify-start md:flex md:w-full",
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({
                      variant: pathname.endsWith(item.href)
                        ? "secondary"
                        : "ghost",
                      // size: "icon",
                    }),
                    "justify-start px-4 md:hidden md:w-full",
                  )}
                >
                  <item.icon />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
