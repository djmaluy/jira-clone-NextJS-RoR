class MembersController < ApplicationController
  expose :workspace, ->{ Workspace.find(params[:workspace_id]) }
  expose :member, ->{ Membership.find_by!(workspace: workspace, user_id: params[:id]) }
  expose :members, ->{ workspace.memberships.includes(:user) }

  def index
  end

  def update
    service = MembershipService.new(current_user, member)
    
    unless service.can_update_role?
      return render json: { error: service.update_error_message }, status: :forbidden
    end

    if member.update(role: params[:role])
      render json: { message: "Ok" }, status: :ok
    else
      render json: { error: "Failed to update role" }, status: :unprocessable_entity
    end
  end

  def destroy
    service = MembershipService.new(current_user, member)
  
    unless service.can_remove_member?
      return render json: { error: service.remove_error_message }, status: :forbidden
    end

    if member.destroy
      render json: { message: "Ok" }, status: :ok
    else
      render json: { error: "Failed to remove member" }, status: :unprocessable_entity
    end
  end
end
