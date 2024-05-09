import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

// TODO
export default async function ForYouRecipesPage() {
  return (
    <section className="container m-3 flex h-full w-full flex-col gap-6">
      <div className="flex flex-row justify-between gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Your recipes
        </h1>
        <div className="flex flex-row gap-3">
          <Link
            href={"/meal-planner"}
            className={buttonVariants({ variant: "secondary", size: "icon" })}
          >
            <Icons.coolStars />
          </Link>
          <Button size={"icon"}>
            <Icons.add />
          </Button>
        </div>
      </div>
      <div className="">test</div>
    </section>
  );
}
