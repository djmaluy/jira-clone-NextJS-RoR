import { getWorkspace } from "@/features/workspaces/api/workspaceApi";
import { useQuery } from "@tanstack/react-query";

export function useGetProject(id: string) {
  const { data, isPending, isError } = useQuery({
    queryKey: ["projects", id],
    queryFn: async ({ queryKey }) => {
      const [, workspaceId] = queryKey;
      return await getWorkspace(workspaceId as string);
    },
    enabled: !!id,
  });

  return {
    workspace: data,
    isPending,
    isError,
  };
}
