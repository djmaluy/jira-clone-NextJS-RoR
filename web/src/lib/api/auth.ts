import { TLoginCredentials, TSignUpCredentials } from "@/types/auth";
import { api } from "../api";

export const authApi = {
  login: async (credentials: TLoginCredentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  signUp: async (data: TSignUpCredentials) => {
    const response = await api.post("/auth/sign_up", { user: data });
    return response.data;
  },
  current: async () => {
    const response = await api.get("/auth/current");
    return response.data;
  },
  logout: async () => {
    const response = await api.delete("/auth/logout");
    return response.data;
  },
};
