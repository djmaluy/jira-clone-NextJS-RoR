import { useQuery } from "@tanstack/react-query";

import { fetchAllProjects } from "../api/projectApi";

export function useFetchProjects(workspaceId: string) {
  const { data, isPending } = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];

      const response = await fetchAllProjects(workspaceId);
      return response;
    },
    enabled: !!workspaceId,
  });

  return {
    projects: data || [],
    isPending: !workspaceId || isPending,
  };
}
