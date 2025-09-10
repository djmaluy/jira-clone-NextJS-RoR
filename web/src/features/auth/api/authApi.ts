import { api } from "@/lib/apiClient";
import { apiUrls } from "@/lib/routes";
import {
  TLoginCredentials,
  TLoginResponse,
  TSignUpCredentials,
  TUser,
} from "@/types/auth";

export const authApi = {
  login: (data: TLoginCredentials) =>
    api.post<TLoginResponse>(`${apiUrls.AUTH}/login`, data),
  signUp: (data: TSignUpCredentials) =>
    api.post<TUser>(`${apiUrls.AUTH}/sign_up`, { user: data }),
  current: () => api.get<TUser>(`${apiUrls.AUTH}/current`),
  logout: () => api.delete(`${apiUrls.AUTH}/logout`),
};
