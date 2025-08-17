import { api } from "@/lib/apiClient";
import { TLoginCredentials, TSignUpCredentials, TUser } from "@/types/auth";

export const authApi = {
  login: (data: TLoginCredentials) => api.post<TUser>("/auth/login", data),
  signUp: (data: TSignUpCredentials) =>
    api.post<TUser>("/auth/sign_up", { user: data }),
  current: () => api.get<TUser>("/auth/current"),
  logout: () => api.delete("/auth/logout"),
};
