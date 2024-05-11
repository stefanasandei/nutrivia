/* eslint-disable @next/next/no-img-element */
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";

export default async function RecipePage({
  params,
}: {
  params: { id: string };
}) {
  const recipe = await api.recipe.get.query({ id: params.id });
  if (recipe == null) return notFound();

  const safe = DOMPurify.sanitize(recipe.content);
  const rendered = await marked.parse(safe);

  return (
    <section className="container m-3 flex h-full w-full flex-col gap-6">
      <div className="flex flex-row justify-between gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          {recipe.title}
        </h1>
        <div className="flex flex-row gap-3">
          {recipe.generated && (
            <span className="rounded-md bg-primary p-2 font-semibold text-primary-foreground">
              AI Generated
            </span>
          )}
        </div>
      </div>

      <div>
        {recipe.pictureURL && (
          <img
            alt={recipe.title}
            className="my-3 rounded-md object-cover md:max-h-64"
            src={recipe.pictureURL}
          />
        )}

        <div className="flex flex-row gap-3">
          <div
            dangerouslySetInnerHTML={{ __html: rendered }}
            className="prose dark:prose-invert prose-li:marker:text-foreground"
          />
        </div>
      </div>
    </section>
  );
}
