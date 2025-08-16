"use client";

import { RiAddCircleFill } from "react-icons/ri";

import { WorkspaceAvatar } from "@/features/workspaces/components/workspace_avatar";
import { useFetchWorkspaces } from "@/features/workspaces/hooks/useFetchWorkspaces";
import { routes } from "@/lib/routes";
import { TWorkspace } from "@/types/workspace";
import { useParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const WorkspaceSwitcher = () => {
  const { workspaces } = useFetchWorkspaces();
  const params = useParams();
  const router = useRouter();

  const onSelect = (id: string) => {
    router.push(`${routes.WORKSPACES}/${id}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500"> Workspaces</p>
        <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
      </div>
      <Select onValueChange={onSelect} value={params.workspaceId as string}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.map((item: TWorkspace) => (
            <SelectItem key={item.id} value={item.id.toString()}>
              <div className="flex justify-start items-center gap-3 font-medium">
                <WorkspaceAvatar name={item.name} image={item.image} />
              </div>
              <span className="truncate">{item.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
