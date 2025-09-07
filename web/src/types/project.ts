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

export type TProjectAnalyticsRes = {
  taskCount: number;
  taskDifference: number;
  projectCount?: number;
  projectDifference?: number;
  incompletedTaskCount?: number;
  incompletedTaskDifference?: number;
  assignedTaskCount: number;
  assignedTaskDifference: number;
  completedTaskCount: number;
  completedTaskDifference: number;
  overdueTaskCount: number;
  overdueTaskDifference: number;
};
