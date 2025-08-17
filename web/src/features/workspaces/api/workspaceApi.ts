import { api } from "@/lib/apiClient";
import { TWorkspace, TWorkspaceReq } from "@/types/workspace";

export const createWorkspace = async (data: TWorkspaceReq) => {
  const res = await api.post<TWorkspace>("/workspaces", data);
  return res.data;
};

export const updateWorkspace = async (data: TWorkspaceReq, id: number) => {
  const res = await api.put<TWorkspace>(`/workspaces/${id}`, data);
  return res.data;
};

export const fetchAllWorkspaces = async () => {
  const res = await api.get<TWorkspace[]>("/workspaces");
  return res.data;
};

export const getWorkspace = async (id: string) => {
  const res = await api.get<TWorkspace>(`/workspaces/${id}`);
  return res.data;
};
