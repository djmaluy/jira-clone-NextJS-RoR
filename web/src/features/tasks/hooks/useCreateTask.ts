import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { TCreateTaskRes, TTaskReq } from "@/types/tasks";

import { createTask } from "../api/taskApi";

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation<
    TCreateTaskRes,
    AxiosError<{ error: string }>,
    { data: TTaskReq }
  >({
    mutationFn: ({ data }) => createTask(data),
    onSuccess: () => {
      toast.success("Successfully created");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      const backendMessage = error.response?.data?.error;
      toast.error(backendMessage || "Failed to create task!");
    },
  });
}
