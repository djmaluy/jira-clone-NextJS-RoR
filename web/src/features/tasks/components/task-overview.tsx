import { TTask } from "@/types/tasks";

import { DottedSeparator } from "@/components/dotted-separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { PencilIcon } from "lucide-react";
import { useEditTaskModal } from "../hooks/useEditTaskModal";
import { TaskDate } from "./due-date";
import { OverviewPropery } from "./overview-property";

type TTaskOverviewProps = {
  task: TTask;
};

export const TaskOverview = ({ task }: TTaskOverviewProps) => {
  const { open } = useEditTaskModal();

  return (
    <div className="flex flex-col gay-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button onClick={() => open(task.id)} size="sm" variant="secondary">
            <PencilIcon className="size-4 mr-2" />
            Edit
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewPropery label="Assignee">
            <MemberAvatar
              name={task.assigneeName as string}
              className="size-6"
            />
            <p className="text-sm font-medium">{task.assigneeName}</p>
          </OverviewPropery>
          <OverviewPropery label="Due Date">
            <TaskDate
              value={task.dueDate as string}
              className="text-sm font-medium"
            />
          </OverviewPropery>
          <OverviewPropery label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewPropery>
        </div>
      </div>
    </div>
  );
};
