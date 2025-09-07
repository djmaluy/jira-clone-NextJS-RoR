import { useQuery } from "@tanstack/react-query";

import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { getProjectAnalytics } from "../api/projectApi";

export function useGetProjectAnalytics(projectId: string) {
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => getProjectAnalytics(workspaceId as string, projectId),
  });

  return {
    projectAnalytics: data,
    isPending,
  };
}
