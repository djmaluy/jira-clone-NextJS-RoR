import request from "@/lib/apiClient";
import { TLoginCredentials, TSignUpCredentials, TUser } from "@/types/auth";

export const authApi = {
  login: (data: TLoginCredentials) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  signUp: (data: TSignUpCredentials) =>
    request("/auth/sign_up", {
      method: "POST",
      body: JSON.stringify({ user: data }),
    }),
  current: async (): Promise<TUser | null> => {
    try {
      const response = await request<TUser>("/auth/current");
      return response;
    } catch (error) {
      if (error instanceof Error && error.message.includes("401")) {
        return null;
      }
      console.error("Unexpected auth error:", error);
      return null;
    }
  },
  logout: () => request("/auth/logout", { method: "DELETE" }),
};
