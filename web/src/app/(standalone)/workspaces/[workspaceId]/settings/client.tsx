"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { useGetWorkspace } from "@/features/workspaces/hooks/useGetWorkspace";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";

export const WorkspaceIdSettingsClient = () => {
  const workspaceId = useWorkspaceId();
  const { workspace, isPending } = useGetWorkspace(workspaceId);

  if (isPending) {
    return <PageLoader />;
  }

  if (!workspace) {
    return <PageError message="Workspace not found" />;
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={workspace} />
    </div>
  );
};
