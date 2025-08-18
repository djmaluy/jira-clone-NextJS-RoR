json.array! @workspaces do |workspace|
  json.extract! workspace, :id, :name, :invitation_code
  json.userId workspace.user_id
  json.invitationCode workspace.invitation_code

  json.imageUrl workspace.image_url
end
