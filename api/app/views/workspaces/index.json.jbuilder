json.array! @workspaces do |workspace|
  json.extract! workspace, :id, :name, :invitational_code
  json.userId workspace.user_id
  json.invitationalCode workspace.invitational_code

  json.imageUrl workspace.image_url
end
