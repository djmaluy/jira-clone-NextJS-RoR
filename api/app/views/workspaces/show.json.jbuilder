json.extract! @workspace, :id, :name
json.userId @workspace.user_id
json.invitationalCode @workspace.invitational_code
json.image @workspace.image_url