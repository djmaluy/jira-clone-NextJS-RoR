import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authApi } from "@/lib/api/auth";
import { routes } from "@/lib/routes";
import { TSignUpCredentials } from "@/types/auth";

export function useSignUp() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: TSignUpCredentials) => authApi.signUp(data),
    onSuccess: () => {
      toast.success("Successfully created, pls log in");
      router.push(routes.SIGN_IN);
    },
    onError: () => {
      toast.error("Failed to create user!");
    },
  });
}
