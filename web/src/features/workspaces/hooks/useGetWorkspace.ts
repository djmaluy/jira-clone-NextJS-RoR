import { getWorkspace } from "@/features/workspaces/api/workspaceApi";
import { useQuery } from "@tanstack/react-query";

export function useGetWorkspace(id: string) {
  const { data, isPending, isError } = useQuery({
    queryKey: ["workspace", id],
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
