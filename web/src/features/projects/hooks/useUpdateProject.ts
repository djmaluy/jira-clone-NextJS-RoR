import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { TProjectReq } from "@/types/project";
import { useRouter } from "next/navigation";
import { updateProject } from "../api/projectApi";

export function useUpdateProject() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
      data,
    }: {
      workspaceId: string;
      projectId: number;
      data: TProjectReq;
    }) => updateProject(workspaceId, projectId, data),
    onSuccess: (project) => {
      toast.success("Successfully updated!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", project.id] });
      router.push(`/workspaces/${project.workspaceId}/projects/${project.id}`);
    },
    onError: () => {
      toast.error("Failed to update workspace!");
    },
  });
}
