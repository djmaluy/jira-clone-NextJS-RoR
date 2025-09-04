export enum TaskStatus {
  BACKLOG = "backlog",
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  IN_REVIEW = "in_review",
  DONE = "done",
}

export type TTask = {
  id: string;
  name: string;
  workspaceId: string;
  projectId: string;
  status: TaskStatus;
  assigneeId: string;
  position: number;
  description?: string;
  projectName?: string;
  assigneeName?: string;
  projectImg?: string;
  dueDate?: string | Date;
};

export type TTaskReq = {
  name?: string;
  workspaceId?: string;
  projectId?: string;
  status: TaskStatus;
  assigneeId?: string;
  dueDate?: string | Date;
  position?: number;
};

export type TCreateTaskRes = {
  id: string;
  workspaceId: string;
};
