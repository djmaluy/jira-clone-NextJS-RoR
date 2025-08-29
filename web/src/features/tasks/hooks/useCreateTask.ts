import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { TCreateTaskRes, TTaskReq } from "@/types/tasks";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { createTask } from "../api/taskApi";

export function useCreateTask() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<
    TCreateTaskRes,
    AxiosError<{ error: string }>,
    { data: TTaskReq }
  >({
    mutationFn: ({ data }) => createTask(data),
    onSuccess: () => {
      toast.success("Successfully created");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // router.push(`/workspaces/${data.workspaceId}/tasks/${data.id}`);
    },
    onError: (error) => {
      const backendMessage = error.response?.data?.error;
      toast.error(backendMessage || "Failed to create task!");
    },
  });
}
