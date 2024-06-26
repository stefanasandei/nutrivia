"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type DateFormatter, DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { type Basket } from "@prisma/client";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  baskets,
  ...props
}: CalendarProps & {
  baskets: Basket[];
}) {
  const formatDay: DateFormatter = (day) => {
    const basketCount = baskets.filter((b) => {
      return (
        b.createdAt.getDate() == day.getDate() &&
        b.createdAt.getMonth() == day.getMonth()
      );
    }).length;

    return (
      <div
        className={cn(
          "flex h-full w-full flex-col gap-3",
          basketCount > 0 ? "rounded-lg ring-2 ring-primary" : "",
        )}
      >
        <p className="text-3xl font-bold">{day.getUTCDate()}</p>
        {basketCount != 0 && (
          <p className="hidden sm:block">
            {basketCount} basket{basketCount == 1 ? "" : "s"}
          </p>
        )}
      </div>
    );
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      formatters={{ formatDay }}
      classNames={{
        months:
          "sm:flex-row w-full h-full flex-1 flex flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 h-full flex flex-col flex-1",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1 h-full flex-1",
        head_row: "flex w-full justify-evenly",
        head_cell:
          "text-muted-foreground rounded-lg w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2 justify-evenly",
        cell: "size-9 size-14 lg:size-32 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-lg [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 size-14 lg:size-32 p-0 font-normal aria-selected:opacity-100",
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({}) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({}) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
