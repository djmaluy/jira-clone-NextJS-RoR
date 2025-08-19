import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { routes } from "@/lib/routes";
import { useCurrent } from "@/providers/AuthProvider";
import { TLoginCredentials, TLoginResponse } from "@/types/auth";
import { toast } from "sonner";
import { authApi } from "../api/authApi";

export function useLogin() {
  const router = useRouter();
  const { checkAuth } = useCurrent();

  return useMutation<TLoginResponse, Error, TLoginCredentials>({
    mutationFn: async (data: TLoginCredentials) => {
      const response = await authApi.login(data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.push(routes.HOME);
      checkAuth();
    },
    onError: () => {
      toast.error("Failed to log in");
    },
  });
}
