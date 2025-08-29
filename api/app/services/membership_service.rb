class MembershipService
  def initialize(current_user, membership)
    @current_user = current_user
    @membership = membership
  end

  def can_update_role?
    return false unless workspace_admin?
    return false if self_action?

    true
  end

  def can_remove_member?
    if self_action?
      return false if last_member?
      return false if last_admin? && workspace_admin?
      return true
    end

    return false unless workspace_admin?
    return false if last_member?
    return false if last_admin?

    true
  end

  def update_error_message
    return 'Access denied. Only workspace admin can manage members.' unless workspace_admin?
    return 'You cannot change your own role.' if self_action?

    'Access denied.'
  end

  def remove_error_message
     if self_action?
      return 'Cannot leave workspace. You are the last member.' if last_member?
      return 'Cannot remove the last admin from workspace.' if last_admin?
      return 'Access denied.'
    end

    return 'Access denied. Only workspace admin can manage members.' unless workspace_admin?
    return 'Cannot remove the last member from workspace.' if last_member?
    return 'Cannot remove the last admin from workspace.' if last_admin?

    'Access denied.'
  end

  private

  attr_reader :current_user, :membership

  def workspace_admin?
    current_user.memberships.find_by(workspace: membership.workspace)&.admin?
  end

  def self_action?
    membership.user == current_user
  end

  def last_member?
    membership.last_member?
  end

  def last_admin?
    membership.admin? && membership.workspace.memberships.where(role: :admin).count <= 1
  end
end
