import { PlusIcon } from "lucide-react";
import Link from "next/link";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectAvatar } from "@/features/projects/components/project_avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/useCreateProjectModal";
import { routes } from "@/lib/routes";
import { TProject } from "@/types/project";

type TProjectListProps = {
  projects: TProject[];
  workspaceId: string;
};

export const ProjectList = ({ projects, workspaceId }: TProjectListProps) => {
  const { open: createProject } = useCreateProjectModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({projects.length})</p>
          <Button variant="secondary" size="icon" onClick={createProject}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`${routes.WORKSPACES}/${workspaceId}${routes.PROJECTS}/${project.id}`}
              >
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="py-4 flex items-center gap-x-2.5">
                    <ProjectAvatar
                      className="size-12"
                      name={project.name}
                      image={project.image}
                    />
                    <p className="text-lg font-medium truncate">
                      {project.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No projects found
          </li>
        </ul>
      </div>
    </div>
  );
};
