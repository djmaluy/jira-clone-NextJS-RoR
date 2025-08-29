class Membership < ApplicationRecord
  belongs_to :user
  belongs_to :workspace

  enum :role, { admin: 0, member: 1 }

  def available_to_demotion?
    return false unless admin?
    workspace.memberships.where(role: :admin).count <= 1
  end

  def last_member?
    workspace.memberships.count <= 1
  end
end
