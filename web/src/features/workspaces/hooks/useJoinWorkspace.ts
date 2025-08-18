import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { joinWorkspace } from "../api/workspaceApi";

export function useJoinWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, code }: { id: number; code: string }) =>
      joinWorkspace(id, code),
    onSuccess: (data) => {
      console.log(data, "======>");
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
    },
    onError: () => {
      toast.error("Failed to join workspace!");
    },
  });
}
