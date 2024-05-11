import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { api } from "@/trpc/server";
import Link from "next/link";

// TODO
export default async function ForYouRecipesPage() {
  const recipes = (await api.recipe.getAll.query())?.recipes ?? [];

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
          <Link
            href={"/for-you/recipes/new"}
            className={buttonVariants({ variant: "default", size: "icon" })}
          >
            <Icons.add />
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="rounded-md bg-secondary/50 p-3 transition-all hover:cursor-pointer hover:bg-secondary/70"
          >
            <p className="text-xl">{recipe.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
