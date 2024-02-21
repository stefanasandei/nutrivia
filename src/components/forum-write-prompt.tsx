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

export default function ForumWritePrompt() {
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<NewPostValues>({
    title: "",
    body: "",
    image: "",
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
        <DialogContent className="flex flex-col justify-between sm:h-[80vh] sm:max-w-[80vw]">
          <section>
            <DialogHeader>
              <DialogTitle>Write a post</DialogTitle>
              <DialogDescription>
                Involved in the community by writing about a great recipe, a
                success story or your thoughts!
              </DialogDescription>
            </DialogHeader>
            <div className="mt-5">
              <NewPostForm
                onChange={(obj) => setFormData(obj)}
                initialValues={formData}
              />
            </div>
          </section>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                setOpenDialog(false);
                if (formData == undefined || formData?.title == "") return;
                createPost.mutate(formData);
                setFormData({ title: "", body: "", image: "" });
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

type NewPostValues = { title: string; body: string; image: string };

function NewPostForm({
  initialValues,
  onChange,
}: {
  initialValues: NewPostValues;
  onChange: (obj: NewPostValues) => void;
}) {
  const formSchema = z.object({
    title: z.string().min(2).max(50),
    body: z.string().max(500).optional(),
  });

  const [title, setTitle] = useState(initialValues.title);
  const [body, setBody] = useState(initialValues.body);
  const [image, setImage] = useState(initialValues.image);

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
                    onChange({ title: value.target.value, body, image });
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
                  className="h-[28vh] max-h-[28vh]"
                  value={body}
                  onChange={(value) => {
                    setBody(value.target.value);
                    onChange({ title, body: value.target.value, image });
                  }}
                />
              </FormControl>
              <FormDescription>This is the body for your post</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Image (optional)</FormLabel>
          <FormControl>
            <UploadButton
              className="flex flex-row items-center justify-start gap-3 ut-button:bg-primary ut-button:text-primary-foreground ut-button:transition ut-button:hover:bg-primary/90"
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                setImage(res[0]?.url ?? "");
                onChange({ title, body, image: res[0]?.url ?? "" });
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
      </form>
    </Form>
  );
}