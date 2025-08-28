import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { useConfirm } from "@/hooks/use-confirm";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useDeleteTask } from "../hooks/useDeleteTask";

type TaskActionProps = {
  id: string;
  projectId: string;
  children: React.ReactNode;
};

export const TaskActions = ({ id, projectId, children }: TaskActionProps) => {
  const { mutate: deleteTask, isPending: isDeletePending } = useDeleteTask();
  const workspaceId = useWorkspaceId();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete task",
    "Are you sure you want to delete this task?",
    "destructive"
  );

  const handleDeleteTask = async () => {
    const confirmed = await confirmDelete();

    if (confirmed) {
      deleteTask({ workspaceId, id });
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => {}}
              disabled={false}
              className="font-medium p-[10px]"
            >
              <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
              Task Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {}}
              disabled={false}
              className="font-medium p-[10px]"
            >
              <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
              Open Project
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {}}
              disabled={false}
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
