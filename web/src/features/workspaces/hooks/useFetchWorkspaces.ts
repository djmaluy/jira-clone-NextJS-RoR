import { useQuery } from "@tanstack/react-query";

import { workspaceApi } from "@/features/workspaces/api/workspaceApi";

export function useFetchWorkspaces() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["workspaces"],
    queryFn: workspaceApi.fetchAll,
  });

  return {
    workspaces: data,
    isPending,
    isError,
  };
}
