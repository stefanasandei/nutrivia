import { type CompleteBasket } from "@/types/basket";
import { FancyBasketPreview } from "../fancy-basket-preview";

export const ForYouFood = ({ baskets }: { baskets: CompleteBasket[] }) => {
  return (
    <div>
      <div className="mt-8 grid grid-cols-1 justify-between justify-items-center gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {baskets.map((basket) => (
          <FancyBasketPreview key={basket.id} basket={basket} />
        ))}
      </div>
    </div>
  );
};
