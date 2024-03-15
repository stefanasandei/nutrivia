"use client";

import { useCompletion } from "ai/react";
import { useEffect, useState, type ChangeEvent } from "react";
import { marked } from "marked";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MealPlannerPage() {
  // state
  const [result, setResult] = useState("");

  // render the generated markdown into html
  const renderContet = async (completion: string) => {
    const res = await marked.parse(completion);
    setResult(res);
  };

  return (
    <section className="container grid items-center gap-6 pb-8 pt-3">
      <div className="mb-3">
        <h1 className="mb-1 text-3xl font-semibold">Try a unique reciepe!</h1>
        <p>
          Want to cook something new? Type in your preferences and we will
          generate a unique recipe for you!
        </p>
      </div>

      <GenerateRecipeForm onReceive={renderContet} />

      <div
        className="prose dark:prose-invert mt-3 w-full max-w-none"
        dangerouslySetInnerHTML={{ __html: result }}
      />
    </section>
  );
}

const GenerateRecipeForm = ({
  onReceive,
}: {
  onReceive: (arg0: string) => Promise<void>;
}) => {
  // ai completion api
  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    setCompletion,
  } = useCompletion({
    api: "/api/meal",
    onFinish: (prompt, completion) => {
      if (USE_CACHE) {
        localStorage.setItem(`recipe-${prompt.trim()}`, completion);
      }
    },
  });

  const USE_CACHE = false;

  // render the generated markdown into html
  useEffect(() => {
    void onReceive(completion);
  }, [onReceive, completion]);

  return (
    <form
      onSubmit={(e) => {
        const key = `recipe-${input.trim()}`;
        const data = localStorage.getItem(key);
        if (data != null && USE_CACHE) {
          // we already generated this, pull for cache
          e.preventDefault();
          setCompletion(data);
        } else {
          handleSubmit(e);
          setInput(input); // or ""
        }
      }}
      className="flex flex-row gap-3"
    >
      <Input
        value={input}
        placeholder="What are you in the mood for?"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleInputChange(e);
        }}
      />
      <Button type="submit">Generate</Button>
    </form>
  );
};
