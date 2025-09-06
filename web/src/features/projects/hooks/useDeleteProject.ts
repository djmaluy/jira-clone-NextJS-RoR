import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteProject } from "../api/projectApi";

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, id }: { workspaceId: string; id: string }) =>
      deleteProject(workspaceId, id),
    onSuccess: () => {
      toast.success("Successfully deleted!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("Failed to delete project!");
    },
  });
}
