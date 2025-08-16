import request from "@/lib/apiClient";
import { TWorkspace, TWorkspaceReq } from "@/types/workspace";

export const workspaceApi = {
  create: (data: TWorkspace | TWorkspaceReq) =>
    request("/workspaces", { method: "POST", body: JSON.stringify(data) }),

  fetchAll: () => request("/workspaces"),
};
