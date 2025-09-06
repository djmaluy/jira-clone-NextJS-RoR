import { useQuery } from "@tanstack/react-query";

import { getWorkspace } from "@/features/workspaces/api/workspaceApi";

export function useGetWorkspace(id: string) {
  const { data, isPending } = useQuery({
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
  };
}
