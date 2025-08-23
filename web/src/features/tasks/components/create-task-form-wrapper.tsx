import { Card, CardContent } from "@/components/ui/card";
import { useFetchMembers } from "@/features/members/hooks/useFetchMembers";
import { useFetchProjects } from "@/features/projects/hooks/useFetchProjects";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { Loader } from "lucide-react";
import { CreateTaskForm } from "./create-task-form";

type CreateTaskFormWrapperProps = {
  onCancel: () => void;
};

export const CreateTaskFormWrapper = ({
  onCancel,
}: CreateTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { projects, isPending: isProjectsLoading } =
    useFetchProjects(workspaceId);
  const { members, isPending: isMembersLoading } = useFetchMembers(workspaceId);

  const isLoading = isProjectsLoading || isMembersLoading;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className=" size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <CreateTaskForm
      projects={projects ?? []}
      members={members ?? []}
      onCancel={onCancel}
    />
  );
};
