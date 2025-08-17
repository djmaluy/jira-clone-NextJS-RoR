import { TUser } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

export function useCurrentUser() {
  const { data, isPending, isError } = useQuery<TUser>({
    queryKey: ["current"],
    queryFn: async () => {
      const response = await authApi.current();
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
  });

  return {
    user: data,
    isPending,
    isError,
  };
}
