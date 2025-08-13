import { authApi } from "@/lib/api/auth";
import { routes } from "@/lib/routes";
import { TLoginCredentials, TSignUpCredentials } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const signUp = useMutation({
    mutationFn: (data: TSignUpCredentials) => authApi.signUp(data),
    onSuccess: () => {
      router.push(routes.SIGN_IN);
    },
  });

  const login = useMutation({
    mutationFn: (data: TLoginCredentials) => authApi.login(data),
    onSuccess: async () => {
      router.push("/");
    },
  });

  const logout = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData(["current-user"], null);
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      router.push(routes.SIGN_IN);
    },
  });

  return {
    signUp: signUp.mutate,
    login: login.mutate,
    logout: logout.mutate,
  };
}
