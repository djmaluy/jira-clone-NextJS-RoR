export enum TaskStatus {
  BACKLOG = "backlog",
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  IN_REVIEW = "in_review",
  DONE = "done",
}

export type TTask = {
  id: number;
  name: string;
  workspaceId: string;
  projectId: string;
  status: TaskStatus;
  assigneeId: string;
  description?: string;
};

export type TTaskReq = {
  task: {
    project_id: string;
    name: string;
    status: TaskStatus;
    due_date: Date;
    assignee_id: string;
    description?: string;
  };
};

export type TCreateTaskRes = {
  message: string;
  id: string;
  workspaceId: string;
};
