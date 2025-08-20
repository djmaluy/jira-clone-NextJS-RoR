import { useQuery } from "@tanstack/react-query";

import { fetchAllProjects } from "../api/projectApi";

export function useFetchProjects(workspaceId: string) {
  const { data, isPending } = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await fetchAllProjects(workspaceId);
      return response;
    },
  });

  return {
    projects: data,
    isPending,
  };
}
