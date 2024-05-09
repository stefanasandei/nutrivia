"use client";

import { useCompletion } from "ai/react";
import { useEffect, useState, type ChangeEvent } from "react";
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

// TODO
export default function MealPlannerPage() {
  // state
  const [result, setResult] = useState("");

  // render the generated markdown into html
  const renderContet = async (completion: string) => {
    const res = await marked.parse(completion);
    setResult(res);
  };

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
            <Input placeholder="Type in what kind of food you want to eat..." />

            <div className="flex flex-row justify-between">
              <div className="flex flex-row items-center gap-2">
                <p>For </p>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Serving size" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="1">One</SelectItem> */}
                    <SelectItem value="2">Two</SelectItem>
                    <SelectItem value="3">Three</SelectItem>
                    <SelectItem value="4">Four</SelectItem>
                    <SelectItem value="5">Five</SelectItem>
                  </SelectContent>
                </Select>{" "}
                <p>people. </p>
              </div>
              <Button>Generate</Button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex flex-row gap-2 rounded-md bg-secondary/50 p-3 transition-all hover:cursor-pointer hover:bg-secondary/70">
                <div className="flex size-6 items-center justify-center rounded-md">
                  🍕
                </div>
                <p>Something casual.</p>
              </div>
              <div className="flex flex-row gap-2 rounded-md bg-secondary/50 p-3 transition-all hover:cursor-pointer hover:bg-secondary/70">
                <div className="flex size-6 items-center justify-center rounded-md">
                  🎉
                </div>
                <p>Unique food for a special day!</p>
              </div>
              <div className="hidden flex-row gap-2 rounded-md bg-secondary/50 p-3 transition-all hover:cursor-pointer hover:bg-secondary/70 sm:flex">
                <div className="flex size-6 items-center justify-center rounded-md">
                  🌮
                </div>
                <p>Want to try something mexican.</p>
              </div>
              <div className="hidden flex-row gap-2 rounded-md bg-secondary/50 p-3 transition-all hover:cursor-pointer hover:bg-secondary/70 sm:flex">
                <div className="flex size-6 items-center justify-center rounded-md">
                  🌾
                </div>
                <p>Tasty and with plenty carbohydrates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ( <section className="container grid items-center gap-6 pb-8 pt-3">
//       <div className="mb-3">
//         <h1 className="mb-1 text-3xl font-semibold">Try a unique reciepe!</h1>
//         <p>
//           Want to cook something new? Type in your preferences and we will
//           generate a unique recipe for you!
//         </p>
//       </div>

//       <GenerateRecipeForm onReceive={renderContet} />

//       <div
//         className="prose mt-3 w-full max-w-none dark:prose-invert"
//         dangerouslySetInnerHTML={{ __html: result }}
//       />
//     </section>)

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
