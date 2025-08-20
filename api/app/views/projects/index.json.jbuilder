json.array! @projects do |project|
  json.id project.id
  json.name project.name
  json.imageUrl project.image_url
end
