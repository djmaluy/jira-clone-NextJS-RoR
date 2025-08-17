import { api } from "@/lib/apiClient";
import { TWorkspace, TWorkspaceReq } from "@/types/workspace";

export const createWorkspace = async (data: TWorkspaceReq) => {
  const res = await api.post<TWorkspace>("/workspaces", data);
  return res.data;
};

export const fetchAllWorkspaces = async () => {
  const res = await api.get<TWorkspace[]>("/workspaces");

  return res.data;
};
