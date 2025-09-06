import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { routes } from "@/lib/routes";
import { TProjectReq } from "@/types/project";

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
      projectId: string;
      data: TProjectReq;
    }) => updateProject(workspaceId, projectId, data),
    onSuccess: (project) => {
      toast.success("Successfully updated!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
      router.push(
        `${routes.WORKSPACES}/${project.workspaceId}${routes.PROJECTS}/${project.id}`
      );
    },
    onError: () => {
      toast.error("Failed to update project!");
    },
  });
}
