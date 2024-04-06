/* eslint-disable @next/next/no-img-element */
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username.split("%40")[1]; // remove "@"
  if (!username) return notFound();

  const user = await api.user.findByUsername.query({
    username: username,
  });
  if (!user) return notFound();

  return (
    <section className=" container grid items-center gap-6 pb-8 pt-3 md:max-w-5xl">
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-1 justify-evenly">
          <img
            src={user.image!}
            className="m-1 size-40 rounded-md"
            alt="profile picture"
          />
        </div>
        <div className="col-span-2 flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            {username}
          </h1>
          <p>{user.bio}</p>
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold">Achievements</p>
        {/*todo*/}
      </div>
    </section>
  );
}
