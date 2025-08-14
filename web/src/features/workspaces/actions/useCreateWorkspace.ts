import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { workspaceApi } from "@/lib/api/workspace";
import { TWorkspace } from "@/types/workspace";

export function useCreateWorkspace() {
  return useMutation({
    mutationFn: (data: TWorkspace) => workspaceApi.create(data),
    onSuccess: () => {
      toast.success("Successfully created workspace!");
    },
    onError: () => {
      toast.error("Failed to create workspace!");
    },
  });
}
