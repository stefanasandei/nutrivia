import { type CompleteBasket } from "@/types/basket";
import { FancyBasketPreview } from "../fancy-basket-preview";

export const ForYouFood = ({ baskets }: { baskets: CompleteBasket[] }) => {
  return (
    <div>
      <div className="mt-8 grid grid-cols-4 justify-evenly justify-items-center gap-6">
        {baskets.map((basket) => (
          <FancyBasketPreview key={basket.id} basket={basket} />
        ))}
      </div>
    </div>
  );
};
