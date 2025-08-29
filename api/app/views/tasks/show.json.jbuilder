json.extract! task, :id, :name, :status, :description
json.workspaceId task.workspace_id
json.dueDate task.due_date
json.projectId task.project_id.to_s
json.assigneeId task.assignee_id.to_s
json.projectName task.project.name