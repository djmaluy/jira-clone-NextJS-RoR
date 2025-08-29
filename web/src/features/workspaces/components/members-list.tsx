"use client";

import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment } from "react";

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
import { useCurrent } from "@/providers/AuthProvider";

export const MembersList = () => {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const { user } = useCurrent();
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

  const currentUser = members?.find(
    (member) => user && member.id === String(user.id)
  );
  const isAdmin = currentUser?.role === "admin";
  const membersCount = members?.length ?? 0;

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
        {members?.map((member, index) => {
          const isCurrentUser = currentUser?.id === member.id;
          const canPromote = isAdmin && member.role !== "admin";
          const canDemote =
            isAdmin && member.role !== "member" && membersCount > 1;
          const canRemove = membersCount > 1;

          const removeText = isCurrentUser
            ? "Leave workspace"
            : `Remove ${member.name}`;

          return (
            <Fragment key={member.id}>
              <div className="flex items-center gap-2">
                <MemberAvatar
                  className="size-10"
                  name={member.email}
                  fallabckClassName="text-lg"
                />
                <div className="flex flex-col">
                  <p className="font-medium text-sm">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.email}
                  </p>
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
                      disabled={isUpdatePending || !canPromote}
                      onClick={() => handleUpdateMember(member.id, "admin")}
                    >
                      Set as admin
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="font-medium cursor-pointer"
                      disabled={isUpdatePending || !canDemote}
                      onClick={() => handleUpdateMember(member.id, "member")}
                    >
                      Set as member
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="font-medium cursor-pointer text-amber-700"
                      disabled={isDeletePending || !canRemove}
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      {removeText}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {index < membersCount - 1 && <Separator className="my-2.5" />}
            </Fragment>
          );
        })}
      </CardContent>
    </Card>
  );
};
