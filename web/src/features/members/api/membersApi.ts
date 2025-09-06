import { api } from "@/lib/apiClient";
import { apiUrls, routes } from "@/lib/routes";
import { TMemberRes, TUpdateRoleRes } from "@/types/members";

export const updateMember = async (
  workspaceId: string,
  userId: string,
  role: string
): Promise<TUpdateRoleRes> => {
  const res = await api.put<TUpdateRoleRes>(
    `${routes.WORKSPACES}/${workspaceId}${apiUrls.MEMBERS}/${userId}`,
    { role }
  );
  return res.data;
};

export const fetchMembers = async (workspaceId: string) => {
  const res = await api.get<TMemberRes[]>(
    `${routes.WORKSPACES}/${workspaceId}${apiUrls.MEMBERS}`
  );
  return res.data;
};

export const deleteMember = async (workspaceId: string, userId: string) => {
  const res = await api.delete<{ message: string }>(
    `${routes.WORKSPACES}/${workspaceId}${apiUrls.MEMBERS}/${userId}`
  );
  return res.data;
};
