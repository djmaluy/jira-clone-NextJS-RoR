import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { deleteMember } from "../api/membersApi";

type TDeleteMemberRes = { message: string };
type TErrorRes = { error: string };

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation<
    TDeleteMemberRes,
    AxiosError<TErrorRes>,
    { workspaceId: string; userId: string }
  >({
    mutationFn: ({ workspaceId, userId }) => deleteMember(workspaceId, userId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Successfully deleted!");
    },

    onError: (error) => {
      const backendMessage = error.response?.data?.error;
      toast.error(backendMessage || "Failed to delete member!");
    },
  });
}
