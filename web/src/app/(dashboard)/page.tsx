import { routes } from "@/lib/routes";
import { serverApi } from "@/lib/serverClient";
import { AxiosError } from "axios";
import { redirect } from "next/navigation";

export default async function Home() {
  const api = await serverApi();

  try {
    const { data: _user } = await api.get("/auth/current");
  } catch (err: unknown) {
    const error = err as AxiosError;

    if (error.response?.status === 401) {
      redirect(routes.SIGN_IN);
    }

    throw error;
  }

  const { data: workspaces } = await api.get("/workspaces");

  if (!workspaces || workspaces.length === 0) {
    redirect("/workspaces/create");
  }

  redirect(`/workspaces/${workspaces[0].id}`);
}
