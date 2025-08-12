import { TLoginCredentials, TSignUpCredentials } from "@/types/auth";
import { api } from "../api";

export const authApi = {
  login: async (credentials: TLoginCredentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  signUp: async (data: TSignUpCredentials) => {
    const response = await api.post("/auth/sign_up", data);
    return response.data;
    console.log("data", data);
  },

  // logout: async () => {
  //   const response = await api.post("/auth/logout");
  //   return response.data;
  // },

  // getCurrentUser: async (): Promise<{ user: User }> => {
  //   const response = await api.get("/auth/me");
  //   return response.data;
  // },
};
