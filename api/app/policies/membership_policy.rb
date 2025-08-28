class MembershipPolicy < ApplicationPolicy
  def update?
    return false unless workspace_admin?
    return false if record.user == user
    
    true
  end

  def destroy?
    return false unless workspace_admin?
    return false if record.last_member?
    return false if record.last_admin?
    return false if record.user == user
    
    true
  end

  def destroy_member_error_message
    case destroy_error_reason
    when :last_member
      'Cannot remove the last member from workspace.'
    when :last_admin
      'Cannot remove the last admin from workspace.'
    when :self_removal
      'You cannot remove yourself from the workspace.'
    when :not_admin
      'Access denied. Only workspace admin can manage members.'
    else
      'Access denied.'
    end
  end

  def update_member_error_message
    case update_error_reason
    when :self_update
      'You cannot change your own role.'
    when :not_admin
      'Access denied. Only workspace admin can manage members.'
    else
      'Access denied.'
    end
  end

  def destroy_error_reason
    return :not_admin unless workspace_admin?
    return :last_member if record.last_member?
    return :last_admin if record.last_admin?
    return :self_removal if record.user == user
    
    nil
  end

  def update_error_reason
    return :not_admin unless workspace_admin?
    return :self_update if record.user == user
    
    nil
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.where(workspace_id: user.memberships.select(:workspace_id))
    end
  end

  private

  def workspace_admin?
    user.memberships.find_by(workspace: record.workspace)&.admin?
  end
end
