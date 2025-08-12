import { authApi } from "@/lib/api/auth";
import { TLoginCredentials, TSignUpCredentials } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const queryClient = useQueryClient();

  const signUp = useMutation({
    mutationFn: (data: TSignUpCredentials) => authApi.signUp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const login = useMutation({
    mutationFn: (data: TLoginCredentials) => authApi.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  return {
    signUp: signUp.mutate,
    login: login.mutate,
  };
}
