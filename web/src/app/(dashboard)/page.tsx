export const dynamic = "force-dynamic";

import { serverApi } from "@/lib/serverClient";
import { redirect } from "next/navigation";

export default async function Home() {
  const api = await serverApi();

  const { data: workspaces } = await api.get("/workspaces");

  if (!workspaces || workspaces.length === 0) {
    redirect("/workspaces/create");
  }

  redirect(`/workspaces/${workspaces[0].id}`);
}
