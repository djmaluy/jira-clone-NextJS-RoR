import { useQuery } from "@tanstack/react-query";

import { getTask } from "../api/taskApi";

export function useGetTask(id: string) {
  const { data, isPending } = useQuery({
    queryKey: ["task", id],
    queryFn: () => getTask(id),
  });

  return { task: data, isPending };
}
