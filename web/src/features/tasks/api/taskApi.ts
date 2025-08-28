import { api } from "@/lib/apiClient";
import { TCreateTaskRes, TTask, TTaskReq } from "@/types/tasks";
import { TUseFetchTasksProps } from "../hooks/useFetchTasks";

const API_TASKS_URL = "/tasks";

export const createTask = async (
  workspaceId: string,
  data: TTaskReq
): Promise<TCreateTaskRes> => {
  const res = await api.post<TCreateTaskRes>(
    `/workspaces/${workspaceId}${API_TASKS_URL}`,
    data
  );
  return res.data;
};

export const fetchTasks = async ({
  workspaceId,
  projectId,
  status,
  search,
  assigneeId,
  dueDate,
}: TUseFetchTasksProps) => {
  const searchParams = new URLSearchParams();

  if (projectId) searchParams.append("project_id", projectId);
  if (status) searchParams.append("status", status);
  if (search) searchParams.append("search", search);
  if (assigneeId) searchParams.append("assignee_id", assigneeId);
  if (dueDate) searchParams.append("due_date", dueDate);

  const res = await api.get<TTask[]>(
    `/workspaces/${workspaceId}${API_TASKS_URL}?${searchParams.toString()}`
  );

  return res.data;
};

export const deleteTask = async (workspaceId: string, id: string) => {
  const res = await api.delete(
    `/workspaces/${workspaceId}${API_TASKS_URL}/${id}`
  );

  return res.data;
};
