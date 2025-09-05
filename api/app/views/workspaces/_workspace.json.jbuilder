json.extract! workspace, :id, :name
json.set! :userId, workspace.user_id
json.set! :invitationalCode, workspace.likes_count

if workspace.image.attached?
  if workspace.image.service.exist?(workspace.image.key)
    json.imageUrl rails_blob_url(workspace.image)
  else
    json.imageUrl nil
    Rails.logger.warn "ActiveStorage file missing for workspace #{workspace.id}"
  end
else
  json.imageUrl nil
end
