json.extract! @workspace, :id, :name
json.userId @workspace.user_id
json.invitationCode @workspace.invitation_code
json.image @workspace.image_url