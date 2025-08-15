import { TWorkspace, TWorkspaceReq } from "@/types/workspace";
import { api } from "../api";

export const workspaceApi = {
  create: async (data: TWorkspace | TWorkspaceReq) => {
    const response = await api.post("/workspaces", data);
    return response.data;
  },
};
