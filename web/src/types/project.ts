export type TProject = {
  id: number;
  name: string;
  image?: string;
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
};
