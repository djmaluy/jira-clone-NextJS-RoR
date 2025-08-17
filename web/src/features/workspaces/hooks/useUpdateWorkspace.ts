import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { TWorkspaceReq } from "@/types/workspace";
import { useRouter } from "next/navigation";
import { updateWorkspace } from "../api/workspaceApi";

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ data, id }: { data: TWorkspaceReq; id: number }) =>
      updateWorkspace(data, id),
    onSuccess: (workspace) => {
      toast.success("Successfully updated workspace!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", workspace.id] });
      router.push(`/workspaces/${workspace.id}`);
    },
    onError: () => {
      toast.error("Failed to update workspace!");
    },
  });
}
