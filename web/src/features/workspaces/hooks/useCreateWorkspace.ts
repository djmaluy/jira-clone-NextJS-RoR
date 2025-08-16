import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { TWorkspaceReq } from "@/types/workspace";
import { workspaceApi } from "../api/workspaceApi";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TWorkspaceReq) => workspaceApi.create(data),
    onSuccess: () => {
      toast.success("Successfully created workspace!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: () => {
      toast.error("Failed to create workspace!");
    },
  });
}
