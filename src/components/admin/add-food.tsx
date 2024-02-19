"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { type User } from "next-auth";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

export default function AddFoodProductForm({ user }: { user: User }) {
  const router = useRouter();

  const addRawFood = api.admin.addRawFood.useMutation({
    onSuccess: () => {
      toast("Raw food record added!");
      router.refresh();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addRawFood.mutate({ id: user.id, name: values.name });
    form.reset();
  }

  return (
    <Form {...form}>
      <h1 className="border-t-2 py-2 text-3xl font-bold">
        Add a raw food product
      </h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                The name of the raw food product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <p className="mb-2">
            You are submitting a raw food product as an admin. This will be
            directly published.
          </p>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
