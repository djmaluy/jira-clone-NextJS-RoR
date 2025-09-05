import { Datepicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchMembers } from "@/features/members/hooks/useFetchMembers";
import { useFetchProjects } from "@/features/projects/hooks/useFetchProjects";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { TaskStatus } from "@/types/tasks";
import { FolderIcon, ListChecksIcon, UserIcon } from "lucide-react";
import { useTaskFilters } from "../hooks/use-task-filters";

type DataFiltersProps = {
  hideProjectFilters?: boolean;
};

export const DataFilters = ({ hideProjectFilters }: DataFiltersProps) => {
  const workspaceId = useWorkspaceId();

  const { projects, isPending: isProjectsLoading } =
    useFetchProjects(workspaceId);
  const { members, isPending: isMembersLoading } = useFetchMembers(workspaceId);
  const isLoading = isProjectsLoading || isMembersLoading;
  const projectOptions = projects?.map((project) => ({
    value: String(project.id),
    label: project.name,
  }));
  const membersOptions = members?.map((member) => ({
    value: String(member.id),
    label: member.name,
  }));
  const [{ status, projectId, assigneeId, dueDate }, setFilters] =
    useTaskFilters();

  const onStatusChange = (value: string) => {
    return value === "all"
      ? setFilters({ status: null })
      : setFilters({ status: value as TaskStatus });
  };

  const onAssigneeChange = (value: string) => {
    return value === "all"
      ? setFilters({ assigneeId: null })
      : setFilters({ assigneeId: value as string });
  };

  const onprojectChange = (value: string) => {
    return value === "all"
      ? setFilters({ projectId: null })
      : setFilters({ projectId: value as string });
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In review</SelectItem>
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={assigneeId ? assigneeId : undefined}
        onValueChange={(value) => onAssigneeChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />
          {membersOptions?.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!hideProjectFilters && (
        <Select
          defaultValue={projectId ?? undefined}
          onValueChange={(value) => onprojectChange(value)}
        >
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2">
              <FolderIcon className="size-4 mr-2" />
              <SelectValue placeholder="All projects" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            <SelectSeparator />
            {projectOptions?.map((project) => (
              <SelectItem key={project.value} value={project.value as string}>
                {project.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Datepicker
        placeholder="Due date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilters({ dueDate: date ? date.toISOString() : null });
        }}
      />
    </div>
  );
};
