import { serverApi } from "@/lib/serverClient";
import { redirect } from "next/navigation";

export default async function Home() {
  const api = await serverApi();
  const { data: workspaces } = await api.get("/workspaces");

  if (workspaces.length === 0) {
    redirect("workspaces/create");
  } else {
    redirect(`workspaces/${workspaces[0]?.id}`);
  }
}
