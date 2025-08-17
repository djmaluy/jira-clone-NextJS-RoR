import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { routes } from "@/lib/routes";
import { useCurrent } from "@/providers/AuthProvider";
import { TLoginCredentials } from "@/types/auth";
import { toast } from "sonner";
import { authApi } from "../api/authApi";

export function useLogin() {
  const router = useRouter();
  const { checkAuth } = useCurrent();

  return useMutation({
    mutationFn: (data: TLoginCredentials) => authApi.login(data),
    onSuccess: () => {
      checkAuth();
      toast.success("Logged in");
      router.push(routes.HOME);
    },
    onError: () => {
      toast.error("Failed to log in");
    },
  });
}
