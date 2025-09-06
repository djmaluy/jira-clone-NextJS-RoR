import { useQuery } from "@tanstack/react-query";

import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { getProject } from "../api/projectApi";

export function useGetProject(id: string) {
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => getProject(workspaceId as string, id),
  });

  return {
    project: data,
    isPending,
  };
}
