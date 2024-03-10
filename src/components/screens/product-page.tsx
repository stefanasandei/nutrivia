"use client";

import {
  type RawFoodProduct,
  type Comment,
  type FoodProduct,
} from "@prisma/client";
import Image from "next/image";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { Input } from "../ui/input";
import { api } from "@/trpc/react";
import { type User } from "next-auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CommentPreview from "../comment";
import NutriScore from "../nutri-score";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/*
TODO Plan:
  - refactor this page to add nutriments
  - refact food products list to view nutriments
  - new food product page to showcase nutriments
  // - compute nutriscore (when missing) based on nutriments

  - stats for the basket based on nutriments
  - check basket and feed for alergies
*/

export default function FoodProductPage({
  food,
  comments,
  user,
}: {
  food: {
    ingredients: RawFoodProduct[];
  } & FoodProduct;
  comments: ({
    createdBy: User;
  } & Comment)[];
  user: User | null;
}) {
  const router = useRouter();

  const [comment, setComment] = useState("");
  const [activeSection, setActiveSection] = useState<
    "brief" | "core" | "health" | "contribute" | null
  >(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".section");
      console.log(sections);

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          setActiveSection(
            section.id as "brief" | "core" | "health" | "contribute",
          );
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const addComment = api.admin.addFoodComment.useMutation({
    onSuccess: () => {
      toast("Comment submitted!");
      router.refresh();
    },
  });

  const deleteComment = api.admin.deleteFoodComment.useMutation({
    onSuccess: () => {
      toast("Comment deleted!");
      router.refresh();
    },
  });

  const likePost = api.admin.likeFoodProduct.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <section className="container grid items-center gap-6 pt-3">
      <div className="sticky top-20 flex w-full flex-col items-center justify-between gap-2 rounded-lg bg-secondary/40 p-3 backdrop-blur-xl">
        <div className="flex w-full flex-row justify-between px-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            {food.name}
          </h1>
          <div className="flex flex-row gap-3">
            {user != null && (
              <Button
                variant="secondary"
                size={"icon"}
                onClick={() => {
                  likePost.mutate({
                    id: food.id,
                    userId: user.id,
                    isLike: true,
                  });
                }}
              >
                <Icons.like
                  fill={food.likedBy.includes(user?.id) ? "white" : "none"}
                />
              </Button>
            )}
            {user != null && (
              <Button
                variant="secondary"
                size={"icon"}
                onClick={() => {
                  likePost.mutate({
                    id: food.id,
                    userId: user.id,
                    isLike: false,
                  });
                }}
              >
                <Icons.dislike
                  fill={food.dislikedBy.includes(user?.id) ? "white" : "none"}
                />
              </Button>
            )}
            <Button size={"icon"} variant={"secondary"}>
              <Icons.share />
            </Button>
          </div>
        </div>
        <div className=" hidden w-full gap-4 px-2 sm:flex">
          <a
            href="#brief"
            className={cn(
              "rounded-lg bg-accent p-3 transition-all hover:cursor-pointer hover:bg-accent/50",
              activeSection == "brief" ? "brightness-150" : "",
            )}
          >
            <p>Brief</p>
          </a>
          <a
            href="#core"
            className={cn(
              "rounded-lg bg-accent p-3 transition-all hover:cursor-pointer hover:bg-accent/50",
              activeSection == "core" ? "brightness-150" : "",
            )}
          >
            <p>For you</p>
          </a>
          <a
            href="#health"
            className={cn(
              "rounded-lg bg-accent p-3 transition-all hover:cursor-pointer hover:bg-accent/50",
              activeSection == "health" ? "brightness-150" : "",
            )}
          >
            <p>Health</p>
          </a>
          <a
            href="#contribute"
            className={cn(
              "rounded-lg bg-accent p-3 transition-all hover:cursor-pointer hover:bg-accent/50",
              activeSection == "contribute" ? "brightness-150" : "",
            )}
          >
            <p>Contribute</p>
          </a>
        </div>
      </div>

      <div className="section" id="brief">
        <BriefProductCard food={food} />
      </div>
      <div className="section" id="core">
        <CoreInfoCard />
      </div>
      <div className="section" id="health">
        <HealthCard />
      </div>

      <div className="section flex w-full flex-col gap-3" id="contribute">
        {user != null && (
          <div className="flex w-full flex-row gap-5">
            <Input
              placeholder="Write a comment here!"
              value={comment}
              onChange={(newValue) => setComment(newValue.target.value)}
            />
            <Button
              size={"icon"}
              onClick={() => {
                addComment.mutate({
                  id: food.id,
                  comment: comment,
                  userId: user.id,
                });
                setComment("");
              }}
            >
              <Icons.send />
            </Button>
          </div>
        )}
        <div>
          {comments.map((comment) => {
            return (
              <div
                key={comment.id}
                className="flex w-full flex-row items-center justify-center"
              >
                <CommentPreview comment={comment} />
                {user?.id == comment.createdById && (
                  <Button
                    size={"icon"}
                    onClick={() => {
                      deleteComment.mutate({ id: comment.id, uid: user.id });
                    }}
                  >
                    <Icons.delete />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const BriefProductCard = ({ food }: { food: FoodProduct }) => {
  const score =
    (food.likedBy.length / (food.likedBy.length + food.dislikedBy.length)) *
    100;

  return (
    <div className="grid grid-cols-1 items-start gap-5 border-b-2 border-b-secondary py-5 md:grid-cols-3 md:gap-2">
      <Image
        className="rounded-lg"
        src={food.image!}
        width={350}
        height={200}
        alt={food.name}
      />
      <div className="flex h-full flex-col space-y-4">
        <div className="col-span-2 flex flex-col gap-3">
          <h1 className="text-3xl">
            <span className="font-bold">Brand</span>: {food.brand}
          </h1>
          <h1 className="text-3xl">
            <span className="font-bold">Weight</span>: {food.weightG} g
          </h1>
          <h1 className="text-3xl">
            <span className="font-bold">Price</span>: {food.priceRON} RON
          </h1>
          <h1 className="text-3xl">
            <span className="font-bold">Social Score</span>:{" "}
            {Number.isNaN(score) ? 100 : score}%
          </h1>
          <h1 className="text-3xl">
            <span className="font-bold">Country of origin</span>:{" "}
            {food.originCountry}
          </h1>
          <h1 className="text-3xl">
            <span className="font-bold">Ingredients</span>:{" "}
          </h1>
          <NutriScore score={food.nutriScore} />
        </div>
      </div>
    </div>
  );
};

const CoreInfoCard = () => {
  return <></>;
};

const HealthCard = () => {
  return <></>;
};

const ContributionCard = () => {
  return <></>;
};
