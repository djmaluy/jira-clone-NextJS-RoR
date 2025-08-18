import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { routes } from "@/lib/routes";
import { serverApi } from "@/lib/serverClient";
import { redirect } from "next/navigation";

type TWorkspaceIdJoinPageProps = {
  params: {
    workspaceId: string;
  };
};

const WorkspaceIdJoinPage = async ({ params }: TWorkspaceIdJoinPageProps) => {
  const { workspaceId } = await params;
  const api = await serverApi();
  const { data: workspace } = await api.get(`/workspaces/${workspaceId}`);

  if (!workspace) {
    redirect(routes.HOME);
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm workspace={workspace} />
    </div>
  );
};

export default WorkspaceIdJoinPage;
