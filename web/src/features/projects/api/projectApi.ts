import { api } from "@/lib/apiClient";
import { TCreateProjectRes, TProject, TProjectReq } from "@/types/project";

const API_PROJECTS_URL = "/projects";

export const createProject = async (
  workspaceId: string,
  data: TProjectReq
): Promise<TCreateProjectRes> => {
  const res = await api.post<TCreateProjectRes>(
    `/workspaces/${workspaceId}${API_PROJECTS_URL}`,
    data
  );
  return res.data;
};

export const fetchAllProjects = async (workspaceId: string) => {
  const res = await api.get<TProject[]>(
    `/workspaces/${workspaceId}${API_PROJECTS_URL}`
  );
  return res.data;
};

// export const updateWorkspace = async (data: TWorkspaceReq, id: number) => {
//   const res = await api.put<TWorkspace>(`${API_WORKSPACES_URL}/${id}`, data);
//   return res.data;
// };

// export const getWorkspace = async (id: string) => {
//   const res = await api.get<TWorkspace>(`${API_WORKSPACES_URL}/${id}`);
//   return res.data;
// };

// export const deleteWorkspace = async (id: number) => {
//   const res = await api.delete(`${API_WORKSPACES_URL}/${id}`);
//   return res.data;
// };
