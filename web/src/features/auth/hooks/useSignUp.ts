import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { TSignUpCredentials } from "@/types/auth";

import { authApi } from "../api/authApi";

export function useSignUp() {
  return useMutation({
    mutationFn: (data: TSignUpCredentials) => authApi.signUp(data),
    onSuccess: () => {
      toast.success(
        "Successfully created account. Pls check your email and confirm it"
      );
    },
    onError: () => toast.error("Failed to create user!"),
  });
}
