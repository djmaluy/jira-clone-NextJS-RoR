import { AxiosError } from "axios";
import { redirect } from "next/navigation";

import { routes } from "./routes";
import { serverApi } from "./serverClient";

export async function requireUser() {
  const api = await serverApi();

  try {
    const { data: user } = await api.get("/auth/session");
    return user;
  } catch (err: unknown) {
    const error = err as AxiosError;

    if (error.response?.status === 401) {
      redirect(routes.SIGN_IN);
    }

    throw error;
  }
}
