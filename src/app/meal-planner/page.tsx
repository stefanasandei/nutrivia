/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCompletion } from "ai/react";
import { type FormEvent, useEffect, useState } from "react";
import { marked } from "marked";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type RecipeResponse = {
  title: string;
  ingredients: string;
  instructions: string;
};

export default function MealPlannerPage() {
  const router = useRouter();

  const { setInput, handleSubmit } = useCompletion({
    api: "/api/meal",
    onFinish: (prompt, completion) => {
      const done = async () => {
        const data = JSON.parse(completion) as RecipeResponse;

        const content = `## Ingredients\n${data.ingredients}\n## Instructions\n${data.instructions}`;
        const res = await marked.parse(content);

        setResult(res);
        setResponse(data);
      };
      void done();
    },
  });

  // state
  const [response, setResponse] = useState<RecipeResponse | null>(null);
  const [result, setResult] = useState("");
  const [prompt, setPrompt] = useState("");
  const [servingSize, setServingSize] = useState("two");

  const create = api.recipe.create.useMutation({
    onSuccess: () => {
      toast("Recipe created!");

      router.push("/for-you/recipes");
    },
  });

  // update input for the useCompletion
  useEffect(() => {
    const data = { prompt, servingSize };
    setInput(JSON.stringify(data));
  }, [prompt, servingSize]);

  // on form submit
  const generate = (event: FormEvent<HTMLFormElement>) => {
    setResult("loading...");
    handleSubmit(event);
  };

  const saveResponse = () => {
    if (!response) return;

    const content = `## Ingredients\n${response.ingredients}\n## Instructions\n${response.instructions}`;

    create.mutate({
      title: response.title,
      generated: true,
      content: content,
      ingredients: [],
    });
  };

  if (result == "") {
    return (
      <section className="container flex h-full flex-1 flex-col pb-8 pt-3">
        {/* vertically center (mx-auto)*/}
        <div className="mx-auto flex h-full w-full flex-1 grow flex-col md:max-w-screen-md">
          {/* horizontally center (items-center) */}
          <div className="flex h-full w-full flex-1 md:items-center">
            {/* now the creation panel/form */}
            <div className="flex w-full flex-col gap-3 lg:mb-20">
              <div className="mb-6 flex flex-col gap-2">
                <p className="text-3xl font-semibold">What will you eat?</p>
                <p className="text-xl text-muted-foreground">
                  Try out some new food with our suggestions. Enter your
                  preferences or event, so we can choose adequate recipes.
                </p>
              </div>
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type in what kind of food you want to eat..."
              />

              <form
                className="flex flex-row justify-between"
                onSubmit={(e) => generate(e)}
              >
                <div className="flex flex-row items-center gap-2">
                  <p>For </p>
                  <Select onValueChange={(value) => setServingSize(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Serving size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">Two</SelectItem>
                      <SelectItem value="3">Three</SelectItem>
                      <SelectItem value="4">Four</SelectItem>
                      <SelectItem value="5">Five</SelectItem>
                    </SelectContent>
                  </Select>{" "}
                  <p>people. </p>
                </div>
                <Button disabled={prompt.length == 0} type="submit">
                  Generate
                </Button>
              </form>

              <div className="mt-4 grid grid-cols-2 gap-4">
                {tips.map((tip) => (
                  <Tip
                    key={tip.emoji}
                    emoji={tip.emoji}
                    tip={tip.tip}
                    onClick={() => setPrompt(tip.tip)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <section className="container flex h-full flex-1 flex-col pb-8 pt-3">
        {/* vertically center (mx-auto)*/}
        <div className="mx-auto mt-4 flex h-full w-full flex-1 grow flex-col md:max-w-screen-md">
          {/* now the creation panel/form */}
          <div className="flex w-full flex-col gap-3 lg:mb-20">
            <div className="flex flex-row gap-3">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type in what kind of food you want to eat..."
              />
              {response == null && (
                <Button disabled={result != "loading..."}>Stop</Button>
              )}
              {response && <Button onClick={() => saveResponse()}>Save</Button>}
            </div>

            {result != "loading..." ? (
              <div>
                <h1 className="mb-5 text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                  {response?.title}
                </h1>
                <div
                  dangerouslySetInnerHTML={{ __html: result }}
                  className="prose dark:prose-invert prose-li:marker:text-foreground"
                />
              </div>
            ) : (
              <div className="my-48 flex h-full w-full items-center justify-center">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="mr-2 animate-spin fill-white text-gray-200 dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    width={60}
                    height={60}
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
}

const tips = [
  {
    emoji: "🍕",
    tip: "Something casual.",
  },
  {
    emoji: "🎉",
    tip: "Unique food for a special day!",
  },
  {
    emoji: "🌮",
    tip: "Want to try something mexican.",
  },
  {
    emoji: "🌾",
    tip: "Tasty and with plenty carbohydrates",
  },
];

const Tip = ({
  emoji,
  tip,
  onClick,
}: {
  emoji: string;
  tip: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={() => onClick()}
      className="flex flex-row gap-2 rounded-md bg-secondary/50 p-3 transition-all hover:cursor-pointer hover:bg-secondary/70"
    >
      <div className="flex size-6 items-center justify-center rounded-md">
        {emoji}
      </div>
      <p>{tip}</p>
    </button>
  );
};
