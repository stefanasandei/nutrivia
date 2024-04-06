"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  completionMsg: z.string(),
  points: z.coerce.number(),
});

export default function AddChallengeForm({
  isMilestone,
}: {
  isMilestone: boolean;
}) {
  const router = useRouter();

  // api mutations
  const addChallenge = api.challenge.addChallenge.useMutation({
    onSuccess: () => {
      if (isMilestone) toast("Milestone created!");
      else toast("Challenge created!");
      router.refresh();
    },
  });

  // form handling
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      completionMsg: "",
      points: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    addChallenge.mutate({
      title: values.title,
      description: values.description,
      completionMsg: values.completionMsg,
      points: values.points,
      isMilestone: isMilestone,
    });

    form.reset();
  }

  return (
    <Form {...form}>
      <h1 className="border-t-2 py-2 text-3xl font-bold">
        Create a {isMilestone ? "milestone" : "challenge"}
      </h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" w-full space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                The name of the milestone. It must be short and intuitive.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <div className="flex flex-row items-center gap-3">
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
              </div>
              <FormDescription>
                Write a description for the milestone. You can use markdown.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="completionMsg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Completion Message</FormLabel>
              <div className="flex flex-row items-center gap-3">
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
              </div>
              <FormDescription>
                Write the completion message. You can use markdown.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="points"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Points awarded</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                The number of points given to users once they finish this
                milestone.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
