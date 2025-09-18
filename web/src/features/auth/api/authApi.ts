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
    api.post<TLoginResponse>(`${apiUrls.AUTH}/session`, data),
  signUp: (data: TSignUpCredentials) =>
    api.post<TUser>(`${apiUrls.AUTH}/users`, { user: data }),
  current: () => api.get<TUser>(`${apiUrls.AUTH}/session`),
  logout: () => api.delete(`${apiUrls.AUTH}/session`),
};
