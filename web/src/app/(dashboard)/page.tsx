"use client";

import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";

export default function Home() {
  return (
    <div className="bg-neutral-500 p-4 h-full">
      <CreateWorkspaceForm onCancel={() => console.log("click")} />
    </div>
  );
}
