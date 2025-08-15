export type TWorkspace = {
  id?: number;
  name: string;
};

export type TWorkspaceReq = {
  workspace: {
    name: string;
    image?: string;
  };
};
