import { api } from "@/lib/apiClient";
import {
  TCreateProjectRes,
  TProject,
  TProjectReq,
  TProjectRes,
} from "@/types/project";

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

export const fetchAllProjects = async (workspaceId: string | undefined) => {
  const res = await api.get<TProject[]>(
    `/workspaces/${workspaceId}${API_PROJECTS_URL}`
  );

  return res.data;
};

export const getProject = async (
  workspaceId: string,
  id: string
): Promise<TProjectRes> => {
  const res = await api.get<TProjectRes>(
    `/workspaces/${workspaceId}${API_PROJECTS_URL}/${id}`
  );

  return res.data;
};

export const updateProject = async (
  workspaceId: string,
  projectId: number,
  data: TProjectReq
) => {
  const res = await api.put<TProject>(
    `/workspaces/${workspaceId}${API_PROJECTS_URL}/${projectId}`,
    data
  );

  return res.data;
};

export const deleteProject = async (workspaceId: string, projectId: number) => {
  const res = await api.delete(
    `/workspaces/${workspaceId}${API_PROJECTS_URL}/${projectId}`
  );

  return res.data;
};
