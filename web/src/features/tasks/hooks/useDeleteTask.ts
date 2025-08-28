import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteTask } from "../api/taskApi";

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ workspaceId, id }: { workspaceId: string; id: string }) =>
      deleteTask(workspaceId, id),
    onSuccess: () => {
      toast.success("Successfully deleted!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to delete task!");
    },
  });
}
