import { TUser } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

export function useCurrentUser() {
  const { data, isPending, isError } = useQuery<TUser | null>({
    queryKey: ["current"],
    queryFn: authApi.current,
    retry: (failureCount, error) => {
      if (error?.message?.includes("401")) {
        return false;
      }
      return failureCount < 2;
    },
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
