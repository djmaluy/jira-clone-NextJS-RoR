"use client";

import { useCurrentUser } from "@/features/auth/actions/useCurrentUser";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { user, isPending } = useCurrentUser();

  useEffect(() => {
    if (!isPending && !user) {
      router.push(routes.SIGN_IN);
    }
  }, [user, isPending, router]);

  return (
    <div className="bg-neutral-500 p-4 h-full">
      <CreateWorkspaceForm onCancel={() => console.log("click")} />
    </div>
  );
}
