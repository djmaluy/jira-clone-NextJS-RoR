import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteProject } from "../api/projectApi";

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ workspaceId, id }: { workspaceId: string; id: number }) =>
      deleteProject(workspaceId, id),
    onSuccess: () => {
      toast.success("Successfully deleted!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // router.push(routes.HOME);
    },
    onError: () => {
      toast.error("Failed to delete project!");
    },
  });
}
