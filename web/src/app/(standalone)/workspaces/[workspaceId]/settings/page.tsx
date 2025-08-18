import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { serverApi } from "@/lib/serverClient";
import { TWorkspace } from "@/types/workspace";
import { redirect } from "next/navigation";

type TWorkspaceIdSettingsPageProps = {
  params: {
    workspaceId: string;
  };
};

const WorkspaceIdSettingsPage = async ({
  params,
}: TWorkspaceIdSettingsPageProps) => {
  const { workspaceId } = await params;
  const api = await serverApi();
  const workspace = await api.get<TWorkspace>(`/workspaces/${workspaceId}`);

  if (!workspace.data) {
    redirect(`/workspaces/${workspaceId}`);
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={workspace.data} />
    </div>
  );
};

export default WorkspaceIdSettingsPage;
