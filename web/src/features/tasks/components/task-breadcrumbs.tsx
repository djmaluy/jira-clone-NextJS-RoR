import { ChevronRightIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "@/features/projects/components/project_avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { useConfirm } from "@/hooks/use-confirm";
import { routes } from "@/lib/routes";
import { TTask } from "@/types/tasks";

import { useDeleteTask } from "../hooks/useDeleteTask";

type TTaskBreadcrumbsProps = {
  task: TTask;
};

export const TaskBreadcrumbs = ({ task }: TTaskBreadcrumbsProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { mutate: removeTask, isPending } = useDeleteTask();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete task",
    "This action cannot be undone",
    "destructive"
  );

  const handleDeeleteTask = async () => {
    const confirmed = await confirmDelete();

    if (confirmed) {
      removeTask(task.id, {
        onSuccess: () => {
          router.push(`${routes.WORKSPACES}/${workspaceId}/${routes.TASKS}`);
        },
      });
    }
  };

  return (
    <>
      <div className="flex items-center gap-x-2">
        <ProjectAvatar
          name={task.projectName as string}
          image={task.projectImg ?? ""}
          className="size-6 lg:size-8"
        />
        <Link href={`/workspaces/${workspaceId}/projects/${task.projectId}`}>
          <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
            {task.projectName}
          </p>
        </Link>
        <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
        <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
        <Button
          onClick={handleDeeleteTask}
          disabled={isPending}
          variant="destructive"
          className="ml-auto"
          size="sm"
        >
          <TrashIcon className="size-4 lg:mr-2" />
          <span className="hidden lg:block">Delete task</span>
        </Button>
      </div>
      <DeleteDialog />
    </>
  );
};
