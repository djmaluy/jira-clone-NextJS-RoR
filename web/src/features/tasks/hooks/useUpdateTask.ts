import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { TCreateTaskRes, TTaskReq } from "@/types/tasks";

import { updateTask } from "../api/taskApi";

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<
    TCreateTaskRes,
    AxiosError<{ error: string }>,
    { id: string; data: TTaskReq }
  >({
    mutationFn: ({ data, id }) => updateTask(data, id),
    onSuccess: (_res, variables) => {
      if (!("position" in variables.data)) {
        toast.success("Successfully updated");
      }
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task"] });
      // router.refresh();
    },
    onError: (error) => {
      const backendMessage = error.response?.data?.error;
      toast.error(backendMessage || "Failed to update task!");
    },
  });
}
