"use client";

import { PencilIcon } from "lucide-react";
import Link from "next/link";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "@/features/projects/components/project_avatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useGetProject } from "@/features/projects/hooks/useGetProject";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { routes } from "@/lib/routes";

export const ProjectIdClient = () => {
  const projectId = useProjectId();
  const workspaceId = useWorkspaceId();
  const { project, isPending } = useGetProject(projectId);

  if (isPending) {
    return <PageLoader />;
  }

  if (!project) {
    return <PageError message="Page not found" />;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.image}
            className="size-8"
          />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div>
          <Button variant="secondary" size={"sm"} asChild>
            <Link
              href={`${routes.WORKSPACES}/${workspaceId}/${routes.PROJECTS}/${projectId}/${routes.SETTINGS}`}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher hideProjectFilters />
    </div>
  );
};
