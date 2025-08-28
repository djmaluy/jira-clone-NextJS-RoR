"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { useDeleteMember } from "@/features/members/hooks/useDeleteMember";
import { useFetchMembers } from "@/features/members/hooks/useFetchMembers";
import { useUpdateMember } from "@/features/members/hooks/useUpdateMember";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment } from "react";

export const MembersList = () => {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const { members } = useFetchMembers(workspaceId);
  const { mutate: updateMember, isPending: isUpdatePending } =
    useUpdateMember();
  const { mutate: deleteMember, isPending: isDeletePending } =
    useDeleteMember();

  const handleUpdateMember = (userId: string, role: string) => {
    updateMember({
      workspaceId,
      userId,
      role,
    });
  };

  const handleDeleteMember = (userId: string) => {
    deleteMember({
      workspaceId,
      userId,
    });
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button asChild variant="secondary" size="sm">
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="size-4" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Members list</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {members?.map((member, index: number) => (
          <Fragment key={member.id}>
            <div className="flex items-center gap-2">
              <MemberAvatar
                className="size-10"
                name={member.email}
                fallabckClassName="text-lg"
              />
              <div className="flex flex-col">
                <p className="font-medium text-sm">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto" size="icon" variant="secondary">
                    <MoreVerticalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    className="font-medium cursor-pointer"
                    disabled={isUpdatePending}
                    onClick={() => handleUpdateMember(member.id, "admin")}
                  >
                    Set as admin
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium cursor-pointer"
                    disabled={isUpdatePending}
                    onClick={() => handleUpdateMember(member.id, "member")}
                  >
                    Set as member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium cursor-pointer text-amber-700"
                    disabled={isDeletePending}
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < members.length - 1 && <Separator className="my-2.5" />}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
