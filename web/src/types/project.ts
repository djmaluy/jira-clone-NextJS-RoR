export type TProject = {
  id: number;
  name: string;
  image?: string;
  workspaceId?: string;
};

export type TProjectReq = {
  project: {
    id?: number;
    name: string;
    image?: string;
  };
};

export type TCreateProjectRes = {
  message: string;
  workspaceId: string;
  id: number;
};

export type TProjectRes = {
  id: number;
  name: string;
  workspaceId: string;
  image?: string;
};
