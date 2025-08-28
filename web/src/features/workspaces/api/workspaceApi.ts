import { api } from "@/lib/apiClient";
import { TWorkspace, TWorkspaceReq } from "@/types/workspace";

export const API_WORKSPACES_URL = "/workspaces";

export const createWorkspace = async (data: TWorkspaceReq) => {
  const res = await api.post<TWorkspace>(API_WORKSPACES_URL, data);
  return res.data;
};

export const updateWorkspace = async (data: TWorkspaceReq, id: number) => {
  const res = await api.put<TWorkspace>(`${API_WORKSPACES_URL}/${id}`, data);
  return res.data;
};

export const fetchAllWorkspaces = async () => {
  const res = await api.get<TWorkspace[]>(API_WORKSPACES_URL);
  return res.data;
};

export const getWorkspace = async (id: string) => {
  const res = await api.get<TWorkspace>(`${API_WORKSPACES_URL}/${id}`);
  return res.data;
};

export const deleteWorkspace = async (id: number) => {
  const res = await api.delete(`${API_WORKSPACES_URL}/${id}`);
  return res.data;
};

export const resetInvitationCode = async (id: number) => {
  const res = await api.put(
    `${API_WORKSPACES_URL}/${id}/reset_invitation_code`
  );
  return res.data;
};

export const joinWorkspace = async (id: number, invitationCode: string) => {
  const res = await api.put(
    `${API_WORKSPACES_URL}/${id}/join?invitation_code=${invitationCode}`
  );
  return res.data;
};
