import { type RawFoodProduct } from "@prisma/client";
import { type User } from "next-auth";

export default function RawFoodList({
  rawFood,
}: {
  user: User;
  rawFood: RawFoodProduct[];
}) {
  return (
    <div>
      <h1 className="border-t-2 py-2 text-3xl font-bold">Raw food products</h1>
      {JSON.stringify(rawFood)}
    </div>
  );
}
