import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "@/features/projects/components/project_avatar";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import { serverApi } from "@/lib/serverClient";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

type ProjectIdPageProps = {
  params: {
    projectId: string;
    workspaceId: string;
  };
};

const ProjectPage = async ({ params }: ProjectIdPageProps) => {
  const api = await serverApi();
  // const _user = await requireUser();
  const { projectId, workspaceId } = await params;

  const { data: project } = await api.get(
    `workspaces/${workspaceId}/projects/${projectId}`
  );

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
              href={`/workspaces/${workspaceId}/projects/${projectId}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher />
    </div>
  );
};

export default ProjectPage;
