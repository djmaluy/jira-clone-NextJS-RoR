export type TWorkspace = {
  id: number;
  name: string;
  image?: string;
  invitationCode?: string;
  tasks: TWorkspaceTask[];
};

export type TWorkspaceReq = {
  workspace: {
    id?: number;
    name: string;
    image?: string;
  };
};

export type TWorkspaceTask = {
  id: number;
  name: string;
  dueDate: string | Date;
  workspaceId: string;
  projectName: string;
};
