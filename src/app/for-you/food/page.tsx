import { Icons } from "@/components/icons";
import { ForYouFood } from "@/components/screens/for-you-food";
import { buttonVariants } from "@/components/ui/button";
import { api } from "@/trpc/server";
import Link from "next/link";

export default async function ForYouCorePage() {
  const baskets = await api.user.getBaskets.query();

  return (
    <section className="container m-3 flex h-full w-full flex-col gap-6">
      <div className="flex flex-row content-center items-start justify-between gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Food baskets
        </h1>
        <Link
          href="/for-you/food/new"
          className={buttonVariants({ size: "icon" })}
        >
          <Icons.add />
        </Link>
      </div>
      <div className="">
        <ForYouFood baskets={baskets} />
      </div>
    </section>
  );
}
