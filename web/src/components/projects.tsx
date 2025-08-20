"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

import { ProjectAvatar } from "@/features/projects/components/project_avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/useCreateProjectModal";
import { useFetchProjects } from "@/features/projects/hooks/useFetchProjects";
import { cn } from "@/lib/utils";

export const Projects = () => {
  const pathname = usePathname();
  const params = useParams();
  const { open } = useCreateProjectModal();
  const { projects } = useFetchProjects(params.workspaceId as string);

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {projects?.map((project) => {
        const fullHref = `/workspaces/${params.workspaceId}/projects/${project.id}`;
        const isActive = pathname === fullHref;

        return (
          <Link href={fullHref} key={project.id}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <ProjectAvatar name={project.name} image={project.image} />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
