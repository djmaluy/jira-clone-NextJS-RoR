export type TWorkspace = {
  id: number;
  name: string;
  image?: string;
};

export type TWorkspaceReq = {
  workspace: {
    name: string;
    image?: string;
  };
};
