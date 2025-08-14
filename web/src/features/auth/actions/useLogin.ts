import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authApi } from "@/lib/api/auth";
import { routes } from "@/lib/routes";
import { TLoginCredentials } from "@/types/auth";
import { toast } from "sonner";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: TLoginCredentials) => authApi.login(data),
    onSuccess: () => {
      toast.success("Logged in");
      router.push(routes.HOME);
    },
    onError: () => {
      toast.error("Failed to log in");
    },
  });
}
