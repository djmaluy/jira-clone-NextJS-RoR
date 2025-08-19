import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AxiosError } from "axios";
import { deleteMember } from "../api/membersApi";

type TDeleteMemberRes = { message: string };
type TErrorRes = { error: string };

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation<
    TDeleteMemberRes,
    AxiosError<TErrorRes>,
    { workspaceId: string; userId: number }
  >({
    mutationFn: ({ workspaceId, userId }) => deleteMember(workspaceId, userId),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success(data.message);
    },

    onError: (error) => {
      const backendMessage = error.response?.data?.error;
      toast.error(backendMessage || "Failed to delete member!");
    },
  });
}
