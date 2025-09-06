"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useGetProject } from "@/features/projects/hooks/useGetProject";

export const ProjectIdSettingsClient = () => {
  const projectId = useProjectId();
  const { project, isPending } = useGetProject(projectId);

  if (isPending) {
    return <PageLoader />;
  }

  if (!project) {
    return <PageError message="Project not found" />;
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={project} />
    </div>
  );
};
