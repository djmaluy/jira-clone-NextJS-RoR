import { fetchAllWorkspaces } from "@/features/workspaces/api/workspaceApi";
import { useQuery } from "@tanstack/react-query";

export function useFetchWorkspaces() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await fetchAllWorkspaces();
      return response;
    },
  });

  return {
    workspaces: data,
    isPending,
    isError,
  };
}
