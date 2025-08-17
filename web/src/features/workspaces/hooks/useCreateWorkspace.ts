import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { TWorkspaceReq } from "@/types/workspace";
import { useRouter } from "next/navigation";
import { createWorkspace } from "../api/workspaceApi";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: TWorkspaceReq) => createWorkspace(data),
    onSuccess: (workspace) => {
      toast.success("Successfully created workspace!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      router.push(`/workspaces/${workspace.id}`);
    },
    onError: () => {
      toast.error("Failed to create workspace!");
    },
  });
}
