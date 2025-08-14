import { authApi } from "@/lib/api/auth";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["current"],
    queryFn: authApi.current,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    user: data,
    isPending,
    isError,
  };
}
