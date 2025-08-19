import { useQuery } from "@tanstack/react-query";
import { fetchMembers } from "../api/membersApi";

export function useFetchMembers(workspaceId: string) {
  const { data, isPending } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await fetchMembers(workspaceId);
      return response;
    },
  });

  return {
    members: data,
    isPending,
  };
}
