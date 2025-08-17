export type TWorkspace = {
  id: number;
  name: string;
  image?: string;
  invitationalCode?: string;
  userId: number;
};

export type TWorkspaceReq = {
  workspace: {
    id?: number;
    name: string;
    image?: string;
  };
};
