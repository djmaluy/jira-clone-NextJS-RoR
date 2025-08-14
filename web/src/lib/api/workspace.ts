import { TWorkspace } from "@/types/workspace";
import { api } from "../api";

export const workspaceApi = {
  create: async (data: TWorkspace) => {
    const response = await api.post("/workspaces", data);
    return response.data;
  },
};
