import { notFound } from "next/navigation";

export default function AdminPage() {
  notFound();

  return (
    <section className="container m-3 grid h-full w-full gap-6">
      <div className="flex flex-row content-center items-start justify-between gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Admin Page
        </h1>
      </div>
      <div className="flex gap-4">empty on purpose (template)</div>
    </section>
  );
}
