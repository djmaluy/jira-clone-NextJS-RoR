json.array! @projects do |project|
  json.id project.id
  json.name project.name
  json.image project.image_url
end
