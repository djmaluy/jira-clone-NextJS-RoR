import { api } from "@/lib/apiClient";
import { TMemberRes, TUpdateRoleRes } from "@/types/members";

const API_MEMBERS_URL = "/members";

export const updateMember = async (
  workspaceId: string,
  userId: string,
  role: string
): Promise<TUpdateRoleRes> => {
  const res = await api.put<TUpdateRoleRes>(
    `/workspaces/${workspaceId}${API_MEMBERS_URL}/${userId}`,
    { role }
  );
  return res.data;
};

export const fetchMembers = async (workspaceId: string) => {
  const res = await api.get<TMemberRes[]>(
    `/workspaces/${workspaceId}${API_MEMBERS_URL}`
  );
  return res.data;
};

export const deleteMember = async (workspaceId: string, userId: string) => {
  const res = await api.delete<{ message: string }>(
    `/workspaces/${workspaceId}${API_MEMBERS_URL}/${userId}`
  );
  return res.data;
};
