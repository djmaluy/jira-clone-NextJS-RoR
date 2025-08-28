class Membership < ApplicationRecord
  belongs_to :user
  belongs_to :workspace

  enum :role, { admin: 0, member: 1 }
end
