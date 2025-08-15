"use client";

import { RiAddCircleFill } from "react-icons/ri";

import { useFetchWorkspaces } from "@/features/workspaces/actions/useFetchWorkspaces";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace_avatar";
import { TWorkspace } from "@/types/workspace";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const WorkspaceSwitcher = () => {
  const { workspaces } = useFetchWorkspaces();

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500"> Workspaces</p>
        <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
      </div>
      <Select>
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
