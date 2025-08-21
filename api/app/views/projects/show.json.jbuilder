json.extract! @project, :id, :name
json.image @project.image_url
json.workspaceId @project.workspace_id