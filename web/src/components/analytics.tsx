import { TProjectAnalyticsRes } from "@/types/project";

import { AnalyticsCard } from "./analytics-card";
import { DottedSeparator } from "./dotted-separator";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

type TAnalyticsProps = {
  data?: TProjectAnalyticsRes;
};

const analyticsConfig = [
  {
    title: "Total Tasks",
    valueKey: "taskCount",
    differenceKey: "taskDifference",
  },
  {
    title: "Assigned Tasks",
    valueKey: "assignedTaskCount",
    differenceKey: "assignedTaskDifference",
  },
  {
    title: "Completed Tasks",
    valueKey: "completedTaskCount",
    differenceKey: "completedTaskDifference",
  },
  {
    title: "Incompleted Tasks",
    valueKey: "incompletedTaskCount",
    differenceKey: "incompletedTaskDifference",
  },
  {
    title: "Overdue Tasks",
    valueKey: "overdueTaskCount",
    differenceKey: "overdueTaskDifference",
  },
];

export const Analytics = ({ data }: TAnalyticsProps) => {
  if (!data) return null;

  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap">
      <div className="flex flex-row">
        {analyticsConfig.map((item, index) => {
          const value = data[item.valueKey as keyof typeof data] ?? 0;
          const diff = data[item.differenceKey as keyof typeof data] ?? 0;

          return (
            <div key={item.title} className="flex items-center min-w-[250px]">
              <AnalyticsCard
                title={item.title}
                value={value}
                variant={diff > 0 ? "up" : "down"}
                increaseValue={diff}
              />
              {index < analyticsConfig.length - 1 && (
                <DottedSeparator direction="vertical" />
              )}
            </div>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
