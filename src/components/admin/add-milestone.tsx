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
  points: z.coerce.number(),
});

export default function AddMilestoneForm() {
  const router = useRouter();

  // api mutations
  const addMilestone = api.challenge.addMilestone.useMutation({
    onSuccess: () => {
      toast("Milestone created!");
      router.refresh();
    },
  });

  // form handling
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      points: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    addMilestone.mutate({
      title: values.title,
      description: values.description,
      points: values.points,
    });

    form.reset();
  }

  return (
    <Form {...form}>
      <h1 className="border-t-2 py-2 text-3xl font-bold">Create a milestone</h1>
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
