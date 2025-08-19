json.array! @members do |membership|
  json.id membership.user.id
  json.name membership.user.name
  json.email membership.user.email
  json.role membership.role
end
