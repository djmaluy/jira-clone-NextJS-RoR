export type TProject = {
  id: string;
  name: string;
  image?: string;
  workspaceId?: string;
};

export type TProjectReq = {
  project: {
    id?: string;
    name: string;
    image?: string;
  };
};

export type TCreateProjectRes = {
  workspaceId: string;
  id: string;
};

export type TProjectRes = {
  id: string;
  name: string;
  workspaceId: string;
  image?: string;
};
