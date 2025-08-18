export type TWorkspace = {
  id: number;
  name: string;
  image?: string;
  invitationCode?: string;
};

export type TWorkspaceReq = {
  workspace: {
    id?: number;
    name: string;
    image?: string;
  };
};
