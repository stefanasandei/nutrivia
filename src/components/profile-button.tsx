/* eslint-disable @next/next/no-img-element */
import { type User } from "next-auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ProfileButton = ({
  user,
  points,
}: {
  user: User | null;
  points: number;
}) => {
  const router = useRouter();

  if (user == null)
    return (
      <Link
        href={""}
        className={buttonVariants()}
        onClick={async () => {
          await signIn();
        }}
      >
        Sign in
      </Link>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-0 ring-0">
        <div className="flex flex-row items-center gap-4 overflow-hidden rounded-md border bg-card pl-2 transition-all hover:bg-secondary/50">
          <div className="flex flex-col">
            <p>{user.name}</p>
            <p className="font-semibold">{points} points</p>
          </div>
          {user.image && (
            <img src={user.image} alt="profile picture" className="size-12" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <p
            className="hover:cursor-pointer"
            onClick={() => {
              // do this instead of a link so the dropdown menu closes on page nav
              router.push("/profile");
            }}
          >
            Profile
          </p>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <p
            className="hover:cursor-pointer"
            onClick={() => router.push("/profile/settings")}
          >
            Settings
          </p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/api/auth/signout">Logout</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
