import { useQuery } from "@tanstack/react-query";

import { TaskStatus } from "@/types/tasks";
import { fetchTasks } from "../api/taskApi";
import { TasksByStatus } from "../components/data-kanban";

export type TUseFetchTasksProps = {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  search?: string | null;
  assigneeId?: string | null;
  dueDate?: string | null;
};

export function useFetchTasks(params: TUseFetchTasksProps) {
  const { data, isPending } = useQuery({
    queryKey: ["tasks", params],
    queryFn: () => fetchTasks(params),
  });

  const emptyTasks: TasksByStatus = {
    [TaskStatus.BACKLOG]: [],
    [TaskStatus.TODO]: [],
    [TaskStatus.IN_PROGRESS]: [],
    [TaskStatus.IN_REVIEW]: [],
    [TaskStatus.DONE]: [],
  };

  const tasksByStatus = data?.tasks ?? emptyTasks;
  const flatTasks = Object.values(tasksByStatus).flat();

  return {
    tasks: tasksByStatus,
    flatTasks,
    isPending,
  };
}
