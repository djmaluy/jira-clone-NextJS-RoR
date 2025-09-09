"use client";

import { SettingsIcon } from "lucide-react";

import { Analytics } from "@/components/analytics";
import { DottedSeparator } from "@/components/dotted-separator";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Card, CardContent } from "@/components/ui/card";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { useFetchMembers } from "@/features/members/hooks/useFetchMembers";
import { useFetchProjects } from "@/features/projects/hooks/useFetchProjects";
import { ProjectList } from "@/features/workspaces/components/project-list";
import { TaskList } from "@/features/workspaces/components/task-list";
import { useGetWorkspace } from "@/features/workspaces/hooks/useGetWorkspace";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/hooks/useGetWorkspaceAnalytics";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { routes } from "@/lib/routes";
import { TMemberRes } from "@/types/members";
import Link from "next/link";

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();
  const { workspaceAnalytics, isPending: isWorkspaceAnalyticsPending } =
    useGetWorkspaceAnalytics();
  const { projects, isPending: isProjectsPending } =
    useFetchProjects(workspaceId);
  const { members, isPending: isMembersPending } = useFetchMembers(workspaceId);
  const { workspace, isPending: isWorkspacePending } =
    useGetWorkspace(workspaceId);

  const isLoading =
    isWorkspaceAnalyticsPending ||
    isProjectsPending ||
    isMembersPending ||
    isWorkspacePending;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!workspaceAnalytics || !projects || !members || !workspace) {
    return <PageError message="Failed to fetch workdpace data" />;
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics data={workspaceAnalytics} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList workspace={workspace} />
        <ProjectList projects={projects} workspaceId={workspaceId} />
        <MembersList members={members} workspaceId={workspaceId} />
      </div>
    </div>
  );
};

type TMembersListProps = {
  members: TMemberRes[];
  workspaceId: string;
};

export const MembersList = ({ members, workspaceId }: TMembersListProps) => {
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({members.length})</p>
          <Link href={`${routes.WORKSPACES}/${workspaceId}${routes.MEMBERS}`}>
            <SettingsIcon className="size-4 text-neutral-400" />
          </Link>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <li key={member.id}>
              <Card className="shadow-none rounded-lg overflow-hidden">
                <CardContent className="p-3 flex flex-col items-center gap-x-2">
                  <MemberAvatar className="size-12" name={member.name} />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="text-lg font-medium line-clamp-1">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {member.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No members found
          </li>
        </ul>
      </div>
    </div>
  );
};
