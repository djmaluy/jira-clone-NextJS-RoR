json.extract! workspace, :id, :name
json.invitationCode workspace.invitation_code
json.image workspace.image_url

json.tasks workspace.tasks do |task|
  json.id task.id
  json.name task.name
  json.status task.status
  json.dueDate task.due_date
  json.workspaceId task.workspace_id.to_s
  json.projectName task.project.name
end
