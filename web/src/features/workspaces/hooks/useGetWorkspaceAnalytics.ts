import { useQuery } from "@tanstack/react-query";

import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";

import { getWorkspaceAnalytics } from "../api/workspaceApi";

export function useGetWorkspaceAnalytics() {
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async () => getWorkspaceAnalytics(workspaceId as string),
  });

  return {
    workspaceAnalytics: data,
    isPending,
  };
}
