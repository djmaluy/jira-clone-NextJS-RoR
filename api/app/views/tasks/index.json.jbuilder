json.array! @tasks do |task|
  json.id task.id
  json.name task.name
  json.status task.status
  json.workspaceId task.workspace_id
  json.projectId task.project_id
  json.assigneeId task.assignee_id
  json.description task.description
end
