import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { TUpdateRoleRes } from "@/types/members";

import { updateMember } from "../api/membersApi";

export function useUpdateMember() {
  const queryClient = useQueryClient();
  return useMutation<
    TUpdateRoleRes,
    AxiosError<{ error: string }>,
    { workspaceId: string; userId: string; role: string }
  >({
    mutationFn: ({ workspaceId, userId, role }) =>
      updateMember(workspaceId, userId, role),

    onSuccess: () => {
      toast.success("Successfully updated!");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },

    onError: (error) => {
      const backendMessage = error.response?.data?.error;
      toast.error(backendMessage || "Failed to update member!");
    },
  });
}
