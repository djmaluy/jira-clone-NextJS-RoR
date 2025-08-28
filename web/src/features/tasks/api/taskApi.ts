import { api } from "@/lib/apiClient";
import { TCreateTaskRes, TTask, TTaskReq } from "@/types/tasks";

import { TUseFetchTasksProps } from "../hooks/useFetchTasks";

const API_TASKS_URL = "/tasks";

export const createTask = async (task: TTaskReq): Promise<TCreateTaskRes> => {
  const { name, workspaceId, projectId, status, assigneeId, dueDate } = task;
  const preparedData = {
    task: {
      name,
      workspace_id: workspaceId,
      project_id: projectId,
      status,
      assignee_id: assigneeId,
      due_date: dueDate,
    },
  };
  const res = await api.post<TCreateTaskRes>(`${API_TASKS_URL}`, preparedData);

  return res.data;
};

export const getTask = async (id: string) => {
  const res = await api.get(`${API_TASKS_URL}/${id}`);

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
  if (workspaceId) searchParams.append("workspace_id", workspaceId);

  const res = await api.get<TTask[]>(
    `${API_TASKS_URL}?${searchParams.toString()}`
  );

  return res.data;
};

export const deleteTask = async (id: string) => {
  const res = await api.delete(`${API_TASKS_URL}/${id}`);

  return res.data;
};

export const updateTask = async (
  task: TTaskReq,
  id: string
): Promise<TCreateTaskRes> => {
  const { name, workspaceId, projectId, status, assigneeId, dueDate } = task;
  const preparedData = {
    task: {
      name,
      workspace_id: workspaceId,
      project_id: projectId,
      status,
      assignee_id: assigneeId,
      due_date: dueDate,
    },
  };
  const res = await api.put<TCreateTaskRes>(
    `${API_TASKS_URL}/${id}`,
    preparedData
  );

  return res.data;
};
