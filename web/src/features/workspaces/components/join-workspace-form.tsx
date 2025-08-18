"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { routes } from "@/lib/routes";
import { TWorkspace } from "@/types/workspace";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useJoinWorkspace } from "../hooks/useJoinWorkspace";

type TJoinWorkspaceForm = {
  workspace: TWorkspace;
};
export const JoinWorkspaceForm = ({ workspace }: TJoinWorkspaceForm) => {
  const { mutate: joinWorkspace } = useJoinWorkspace();
  const router = useRouter();

  const onSubmit = () => {
    joinWorkspace(
      {
        id: workspace.id,
        code: workspace.invitationCode as string,
      },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspace.id}`);
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join <strong>{workspace.name}</strong>
          &nbsp;workspace
        </CardDescription>
      </CardHeader>
      <div className="p-7">
        <DottedSeparator />
      </div>
      <CardContent>
        <div className="flex flex-col lg:flex-row  gap-2 items-center justify-between pb-7">
          <Button
            size="lg"
            asChild
            variant="secondary"
            type="button"
            className="w-full lg:w-fit"
          >
            <Link href={routes.HOME}>Cancel</Link>
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            size="lg"
            className="w-full lg:w-fit"
          >
            Join workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
