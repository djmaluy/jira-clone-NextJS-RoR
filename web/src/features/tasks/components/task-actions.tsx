import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { useConfirm } from "@/hooks/use-confirm";
import { routes } from "@/lib/routes";

import { useDeleteTask } from "../hooks/useDeleteTask";
import { useEditTaskModal } from "../hooks/useEditTaskModal";

type TaskActionProps = {
  id: string;
  projectId: string;
  children: React.ReactNode;
};

export const TaskActions = ({ id, projectId, children }: TaskActionProps) => {
  const router = useRouter();
  const { mutate: deleteTask, isPending: isDeletePending } = useDeleteTask();
  const workspaceId = useWorkspaceId();
  const { open } = useEditTaskModal();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete task",
    "Are you sure you want to delete this task?",
    "destructive"
  );

  const handleDeleteTask = async () => {
    const confirmed = await confirmDelete();

    if (confirmed) deleteTask(id);
  };

  const onOpenProject = () => {
    router.push(
      `${routes.WORKSPACES}/${workspaceId}/${routes.PROJECTS}/${projectId}`
    );
  };

  const onOpenTask = () => {
    router.push(`${routes.WORKSPACES}/${workspaceId}/${routes.TASKS}/${id}`);
  };

  return (
    <>
      <div className="flex justify-end">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={onOpenTask}
              className="font-medium p-[10px]"
            >
              <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
              Task Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onOpenProject}
              className="font-medium p-[10px]"
            >
              <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
              Open Project
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => open(id)}
              className="font-medium p-[10px]"
            >
              <PencilIcon className="size-4 mr-2 stroke-2" />
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteTask}
              disabled={isDeletePending}
              className="font-medium text-amber-700 hover:text-amber-700 p-[10px]"
            >
              <TrashIcon className="size-4 mr-2 stroke-2" />
              Delete task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DeleteDialog />
    </>
  );
};
