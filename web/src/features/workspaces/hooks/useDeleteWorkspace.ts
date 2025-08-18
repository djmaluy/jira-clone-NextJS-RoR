import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { routes } from "@/lib/routes";
import { deleteWorkspace } from "../api/workspaceApi";

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: number) => deleteWorkspace(id),
    onSuccess: () => {
      toast.success("Successfully deleted!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      router.push(routes.HOME);
    },
    onError: () => {
      toast.error("Failed to create workspace!");
    },
  });
}
