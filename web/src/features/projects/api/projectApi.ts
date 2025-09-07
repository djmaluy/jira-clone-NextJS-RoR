import { api } from "@/lib/apiClient";
import { apiUrls } from "@/lib/routes";
import {
  TCreateProjectRes,
  TProject,
  TProjectReq,
  TProjectRes,
} from "@/types/project";

export const createProject = async (
  workspaceId: string,
  data: TProjectReq
): Promise<TCreateProjectRes> => {
  const res = await api.post<TCreateProjectRes>(
    `${apiUrls.WORKSPACES}/${workspaceId}${apiUrls.PROJECTS}`,
    data
  );
  return res.data;
};

export const fetchAllProjects = async (workspaceId: string | undefined) => {
  const res = await api.get<TProject[]>(
    `${apiUrls.WORKSPACES}/${workspaceId}${apiUrls.PROJECTS}`
  );

  return res.data;
};

export const getProject = async (
  workspaceId: string,
  id: string
): Promise<TProjectRes> => {
  const res = await api.get<TProjectRes>(
    `${apiUrls.WORKSPACES}/${workspaceId}${apiUrls.PROJECTS}/${id}`
  );

  return res.data;
};

export const updateProject = async (
  workspaceId: string,
  projectId: string,
  data: TProjectReq
) => {
  const res = await api.put<TProject>(
    `${apiUrls.WORKSPACES}/${workspaceId}${apiUrls.PROJECTS}/${projectId}`,
    data
  );

  return res.data;
};

export const deleteProject = async (workspaceId: string, projectId: string) => {
  const res = await api.delete(
    `${apiUrls.WORKSPACES}/${workspaceId}${apiUrls.PROJECTS}/${projectId}`
  );

  return res.data;
};

export const getProjectAnalytics = async (
  workspaceId: string,
  projectId: string
) => {
  const res = await api.get(
    `${apiUrls.WORKSPACES}/${workspaceId}${apiUrls.PROJECTS}/${projectId}/${apiUrls.PROJECT_ANALYTICS}`
  );

  return res.data;
};
