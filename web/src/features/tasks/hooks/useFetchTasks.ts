import { useQuery } from "@tanstack/react-query";

import { TaskStatus } from "@/types/tasks";
import { fetchTasks } from "../api/taskApi";

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

  return { tasks: data, isPending };
}
