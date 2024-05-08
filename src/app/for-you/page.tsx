import { Icons } from "@/components/icons";
import { ForYouFood } from "@/components/screens/for-you-food";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";

export default async function ForYouCorePage() {
  const baskets = await api.user.getBaskets.query();

  return (
    <section className="container m-3 flex h-full w-full flex-col gap-6">
      <div className="flex flex-row content-center items-start justify-between gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Food baskets
        </h1>
        <Button size={"icon"}>
          <Icons.add />
        </Button>
      </div>
      <div className="">
        <ForYouFood baskets={baskets} />
      </div>
    </section>
  );
}
