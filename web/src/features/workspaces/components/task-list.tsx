import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateTaskModal } from "@/features/tasks/hooks/useCreateTaskModal";
import { routes } from "@/lib/routes";
import { TWorkspace } from "@/types/workspace";

type TTaskListProps = {
  workspace: TWorkspace;
};

export const TaskList = ({ workspace }: TTaskListProps) => {
  const { open: createTask } = useCreateTaskModal();
  const tasks = workspace.tasks;

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({tasks.length})</p>
          <Button variant="muted" size="icon" onClick={createTask}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {tasks.map((task) => (
            <li key={task.id}>
              <Link
                href={`${routes.WORKSPACES}/${workspace.id}${routes.TASKS}/${task.id}`}
              >
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="py-4">
                    <p className="text-lg font-medium truncate">{task.name}</p>
                    <div className="flex items-center gap-x-2">
                      <p>{task.projectName}</p>
                      <div className="size-1 rounded-full bg-neutral-300" />
                      <div className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="size-3 mr-1" />
                        <span className="truncate">
                          {formatDistanceToNow(new Date(task.dueDate))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No tasks found
          </li>
        </ul>
        <Button variant="muted" className="mt-4 w-full" asChild>
          <Link href={`${routes.WORKSPACES}/${workspace.id}${routes.TASKS}`}>
            Show All
          </Link>
        </Button>
      </div>
    </div>
  );
};
