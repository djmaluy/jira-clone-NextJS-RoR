import { DottedSeparator } from "@/components/dotted-separator";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project_avatar";
import { TTask } from "@/types/tasks";
import { MoreHorizontal } from "lucide-react";
import { TaskDate } from "./due-date";
import { TaskActions } from "./task-actions";

type TKanbanCardProps = {
  task: TTask;
};

export const KanbanCard = ({ task }: TKanbanCardProps) => {
  return (
    <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm line-clamp-2">{task.name}</p>
        <TaskActions id={task.id} projectId={task.projectId}>
          <MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition cursor-pointer" />
        </TaskActions>
      </div>
      <DottedSeparator />
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar
          name={task.assigneeName as string}
          fallabckClassName="text-[10px]"
        />
        <div className="size-1 rounded-full bg-neutral-300" />
        <TaskDate value={task.dueDate as string} className="text-xs" />
      </div>
      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar
          name={task.projectName as string}
          image={task.projectImg}
          className="text-[10px]"
        />
        <span className="text-xs font-medium">{task.projectName}</span>
      </div>
    </div>
  );
};
