/* eslint-disable @next/next/no-img-element */
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
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ChipsInput, { type ChipOption } from "../chips-input";
import { useState } from "react";
import { type RawFoodProduct, type User } from "@prisma/client";
import { Checkbox } from "../ui/checkbox";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  bio: z.string(),
  vegan: z.boolean(),
});

export default function EditProfileForm({
  user,
  food,
  allergies: userallergies,
}: {
  user: User;
  food: RawFoodProduct[];
  allergies: RawFoodProduct[];
}) {
  const router = useRouter();

  const updateProfile = api.user.update.useMutation({
    onSuccess: () => {
      toast("Profile updated!");
      router.refresh();
    },
  });

  const [allergies, setAllergies] = useState<ChipOption[]>(
    !userallergies
      ? []
      : userallergies.map((value) => {
          return {
            name: value.name,
            id: value.id,
          };
        }),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.name!,
      bio: user.bio,
      vegan: user.isVegan,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateProfile.mutate({
      id: user.id,
      username: values.username,
      bio: values.bio,
      allergies: allergies,
      vegan: values.vegan,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="gird-cols-1 grid md:grid-cols-3">
          <div className="col-span-1 grid justify-evenly">
            <img
              src={user.image!}
              className="m-1 size-40 rounded-md"
              alt="profile picture"
            />
          </div>
          <div className="col-span-2 grid space-y-2">
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
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Write someting about yourself and your nutrition goals!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormItem>
          <FormLabel>allergies</FormLabel>
          <FormControl>
            <ChipsInput
              placeholder="allergies"
              options={food.map((value) => {
                return {
                  name: value.name,
                  id: value.id,
                };
              })}
              value={allergies}
              setValue={(newValue) => {
                setAllergies(newValue);
              }}
            />
          </FormControl>
          <FormDescription>
            Add here any ingredients you have alergic reactions to.
          </FormDescription>
          <FormMessage />
        </FormItem>
        <FormField
          control={form.control}
          name="vegan"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  onCheckedChange={field.onChange}
                  defaultChecked={field.value}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Are you vegan?</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
