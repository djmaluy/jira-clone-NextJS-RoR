import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { resetInvitationCode } from "../api/workspaceApi";

export function useResetInvitationCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => resetInvitationCode(id),
    onSuccess: (workspace) => {
      toast.success("Successfully resetted!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", workspace.id] });
    },
    onError: () => {
      toast.error("Failed to reset invitation code!");
    },
  });
}
