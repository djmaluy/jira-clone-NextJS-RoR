import { Loader } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useFetchMembers } from "@/features/members/hooks/useFetchMembers";
import { useFetchProjects } from "@/features/projects/hooks/useFetchProjects";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";

import { useGetTask } from "../hooks/useGetTask";
import { EditTaskForm } from "./edit-task-form";

type EditTaskFormWrapperProps = {
  onCancel: () => void;
  id: string;
};

export const EditTaskFormWrapper = ({
  onCancel,
  id,
}: EditTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();
  const { projects, isPending: isProjectsLoading } =
    useFetchProjects(workspaceId);
  const { members, isPending: isMembersLoading } = useFetchMembers(workspaceId);
  const { task: initialValue, isPending: isGetTaskPending } = useGetTask(id);

  const isLoading = isProjectsLoading || isMembersLoading || isGetTaskPending;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className=" size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  if (!initialValue) return null;

  return (
    <EditTaskForm
      projects={projects ?? []}
      members={members ?? []}
      onCancel={onCancel}
      initialValues={initialValue}
    />
  );
};
