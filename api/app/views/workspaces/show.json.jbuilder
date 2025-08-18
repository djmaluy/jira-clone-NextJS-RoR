json.extract! @workspace, :id, :name
json.invitationCode @workspace.invitation_code
json.image @workspace.image_url