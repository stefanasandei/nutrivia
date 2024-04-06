"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "./ui/textarea";
import { UploadButton } from "./uploadthing";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { type User } from "next-auth";
import ChipsInput from "./chips-input";
import { type Challenges } from "@prisma/client";

export default function ForumWritePrompt({
  agree,
  challenges,
}: {
  challenges: Challenges[];
  user: User;
  agree: boolean;
}) {
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<NewPostValues>({
    title: "",
    body: "",
    image: "",
    challengeId: "",
  });

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      toast("Post created!");
      router.refresh();
    },
  });

  return (
    <div className="flex flex-row items-center gap-5">
      <Input
        placeholder="Write a post!"
        className="hidden sm:flex"
        onFocus={() => setOpenDialog(true)}
      />
      <Button
        size={"icon"}
        variant={"default"}
        onClick={() => setOpenDialog(true)}
        className="sm:w-14"
      >
        <Icons.write />
      </Button>
      <Dialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
        <DialogContent className="flex flex-col justify-between sm:h-[85vh] sm:max-w-[80vw]">
          <section>
            <DialogHeader>
              <DialogTitle>Write a post</DialogTitle>
              <DialogDescription>
                Involved in the community by writing about a great recipe, a
                success story or your thoughts!
              </DialogDescription>
              <Link href={"/forum/rules"} target="_blank">
                <Alert className="my-3 transition hover:cursor-pointer hover:bg-secondary">
                  <Icons.warning className="size-5" />
                  <AlertTitle>Heads up!</AlertTitle>
                  <AlertDescription>
                    {!agree ? (
                      <p>
                        You need to review and agree with our Community
                        Guidelines before you can participate in the forum!
                      </p>
                    ) : (
                      <p>
                        Don&apos;t forget to follow our Community Guidelines!
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              </Link>
            </DialogHeader>
            <div className="">
              <NewPostForm
                allChallenges={challenges}
                onChange={(obj) => setFormData(obj)}
                initialValues={formData}
              />
            </div>
          </section>
          <DialogFooter className="flex flex-col items-center gap-1">
            {!agree && (
              <p>
                You need to agree to the{" "}
                <Link
                  href={"/forum/rules"}
                  className="hover:underline"
                  target="_blank"
                >
                  Community Guidelines
                </Link>{" "}
                first.
              </p>
            )}
            <Button
              type="submit"
              disabled={!agree}
              onClick={() => {
                setOpenDialog(false);
                if (formData == undefined || formData?.title == "") return;
                createPost.mutate(formData);
                setFormData({
                  title: "",
                  body: "",
                  image: "",
                  challengeId: "",
                });
              }}
            >
              Submit post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type NewPostValues = {
  title: string;
  body: string;
  image: string;
  challengeId: string;
};

function NewPostForm({
  initialValues,
  allChallenges,
  onChange,
}: {
  initialValues: NewPostValues;
  onChange: (obj: NewPostValues) => void;
  allChallenges: Challenges[];
}) {
  const formSchema = z.object({
    title: z.string().min(2).max(50),
    body: z.string().max(500).optional(),
  });

  const [title, setTitle] = useState(initialValues.title);
  const [body, setBody] = useState(initialValues.body);
  const [image, setImage] = useState(initialValues.image);

  const [challenges, setChallenges] = useState<{ id: number; name: string }[]>(
    [],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialValues.title,
      body: initialValues.body,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const getCID = () => {
    return (
      allChallenges.filter((c) => c.title == challenges[0]?.name)[0]?.id ?? ""
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={title}
                  onChange={(value) => {
                    setTitle(value.target.value);
                    onChange({
                      title: value.target.value,
                      body,
                      image,
                      challengeId: getCID(),
                    });
                  }}
                />
              </FormControl>
              <FormDescription>This is the title for your post</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({}) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Textarea
                  className="h-[15vh] max-h-[25vh]"
                  value={body}
                  onChange={(value) => {
                    setBody(value.target.value);
                    onChange({
                      title: title,
                      body: value.target.value,
                      image,
                      challengeId: getCID(),
                    });
                  }}
                />
              </FormControl>
              <FormDescription>This is the body for your post</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row items-center justify-between">
          <FormItem>
            <FormLabel>Image (optional)</FormLabel>
            <FormControl>
              <UploadButton
                className="flex flex-row items-center justify-start gap-3 ut-button:bg-primary ut-button:text-primary-foreground ut-button:transition ut-button:hover:bg-primary/90"
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setImage(res[0]?.url ?? "");
                  onChange({
                    title,
                    body,
                    image: res[0]?.url ?? "",
                    challengeId: getCID(),
                  });
                  alert("Upload complete!");
                }}
                onUploadError={(error: Error) => {
                  alert(
                    `Please refresh the page and try again. Upload error: ${error.message}`,
                  );
                }}
              />
            </FormControl>
            <FormDescription>
              Upload an image with the food product.
            </FormDescription>
            <FormMessage />
          </FormItem>
          <FormItem>
            <FormLabel>Challenge (optional)</FormLabel>
            <FormControl>
              <ChipsInput
                placeholder="challenge"
                options={allChallenges.map((c) => {
                  return { id: getHash(c.id), name: c.title };
                })}
                value={challenges}
                setValue={(newValue) => {
                  setChallenges(newValue);
                }}
              />
            </FormControl>
            <FormDescription>
              Want to start a community challenge? Add a challenge to kick start
              the group effort!
            </FormDescription>
            <FormMessage />
          </FormItem>
        </div>
      </form>
    </Form>
  );
}

function getHash(input: string) {
  let hash = 0;
  const len = input.length;
  for (let i = 0; i < len; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // to 32bit integer
  }
  return hash;
}
