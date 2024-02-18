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
import ChipsInput, { ChipOption } from "../chips-input";
import { useState } from "react";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function EditProfileForm({ user }: { user: User }) {
  const router = useRouter();

  const updateProfile = api.user.update.useMutation({
    onSuccess: () => {
      toast("Profile updated!");
      router.refresh();
    },
  });

  const [alergies, setAlergies] = useState<ChipOption[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.name!,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    alert(JSON.stringify(alergies));
    updateProfile.mutate({
      id: user.id,
      username: values.username,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Alergies</FormLabel>
          <FormControl>
            <ChipsInput
              placeholder="Alergies"
              options={[
                { name: "A", id: 1 },
                { name: "B", id: 2 },
                { name: "C", id: 3 },
                { name: "D", id: 4 },
              ]}
              savedOptions={[{ name: "A", id: 1 }]}
              onUpdate={(newValue) => {
                setAlergies(newValue);
              }}
            />
          </FormControl>
          <FormDescription>
            Add here any ingredients you have alergic reactions to.
          </FormDescription>
          <FormMessage />
        </FormItem>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
