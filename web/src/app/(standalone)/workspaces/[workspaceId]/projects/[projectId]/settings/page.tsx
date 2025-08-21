import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { serverApi } from "@/lib/serverClient";

type ProjectIdSettingsPageProps = {
  params: {
    projectId: string;
    workspaceId: string;
  };
};

const ProjectIdSettingsPage = async ({
  params,
}: ProjectIdSettingsPageProps) => {
  const api = await serverApi();
  // const _user = await requireUser();
  const { projectId, workspaceId } = params;
  const { data: project } = await api.get(
    `workspaces/${workspaceId}/projects/${projectId}`
  );

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={project} />
    </div>
  );
};

export default ProjectIdSettingsPage;
