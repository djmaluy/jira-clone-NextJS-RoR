"use client";

import { Loader, PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useCallback } from "react";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { TaskStatus } from "@/types/tasks";

import { columns } from "./columns";
import { DataCalendar } from "./data-calendar";
import { DataFilters } from "./data-filters";
import { DataKanban } from "./data-kanban";
import { DataTable } from "./data-table";

import { useTaskFilters } from "../hooks/use-task-filters";
import { useCreateTaskModal } from "../hooks/useCreateTaskModal";
import { useFetchTasks } from "../hooks/useFetchTasks";
import { useUpdateTask } from "../hooks/useUpdateTask";

const TaskViewSwitcher = () => {
  const [{ status, projectId, assigneeId, dueDate }] = useTaskFilters();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });
  const { open } = useCreateTaskModal();
  const { mutate: update } = useUpdateTask();
  const workspaceId = useWorkspaceId();
  const { tasks, flatTasks, isPending } = useFetchTasks({
    workspaceId,
    status,
    projectId,
    assigneeId,
    dueDate,
  });

  const onKanbanChange = useCallback(
    (task: { id: string; status: TaskStatus; position: number }) => {
      update({
        data: {
          status: task.status,
          position: task.position,
        },
        id: task.id as string,
      });
    },
    [update]
  );

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="w-full flex-1 border rounded-lg"
    >
      <div className="h-full flex flex-col owerflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className=" w-full lg:w-auto">
            <TabsTrigger className="w-full lg:w-auto h-8" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="w-full lg:w-auto h-8" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="w-full lg:w-auto h-8" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button className="w-full lg:w-auto" size={"sm"} onClick={open}>
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isPending ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent className="mt-0" value="table">
              <DataTable columns={columns} data={flatTasks ?? []} />
            </TabsContent>
            <TabsContent className="mt-0" value="kanban">
              {tasks && (
                <DataKanban onChange={onKanbanChange} data={{ tasks }} />
              )}
            </TabsContent>
            <TabsContent className="mt-0 h-full pb-4" value="calendar">
              <DataCalendar data={flatTasks ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default TaskViewSwitcher;
