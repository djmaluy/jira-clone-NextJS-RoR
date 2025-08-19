import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { TUpdateRoleRes } from "@/types/members";
import { AxiosError } from "axios";
import { updateMember } from "../api/membersApi";

export function useUpdateMember() {
  return useMutation<
    TUpdateRoleRes,
    AxiosError<{ error: string }>,
    { workspaceId: string; userId: number; role: string }
  >({
    mutationFn: ({ workspaceId, userId, role }) =>
      updateMember(workspaceId, userId, role),

    onSuccess: (data) => {
      toast.success(data.message);
    },

    onError: (error) => {
      const backendMessage = error.response?.data?.error;
      toast.error(backendMessage || "Failed to update workspace!");
    },
  });
}
