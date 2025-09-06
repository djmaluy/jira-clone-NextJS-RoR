"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { useGetWorkspace } from "@/features/workspaces/hooks/useGetWorkspace";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";

export const WorkspaceIdJoinClient = () => {
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
      <JoinWorkspaceForm workspace={workspace} />
    </div>
  );
};
