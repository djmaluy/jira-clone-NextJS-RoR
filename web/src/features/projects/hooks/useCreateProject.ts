import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { TCreateProjectRes, TProjectReq } from "@/types/project";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { createProject } from "../api/projectApi";

export function useCreateProject() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<
    TCreateProjectRes,
    AxiosError<{ error: string }>,
    { workspaceId: string; data: TProjectReq }
  >({
    mutationFn: ({ workspaceId, data }) => createProject(workspaceId, data),
    onSuccess: (data) => {
      toast.success("Successfully created");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push(`/workspaces/${data.workspaceId}/projects/${data.id}`);
    },
    onError: (error) => {
      const backendMessage = error.response?.data?.error;
      toast.error(backendMessage || "Failed to create project!");
    },
  });
}
