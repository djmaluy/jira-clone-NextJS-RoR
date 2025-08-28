class MembersController < ApplicationController
  expose :workspace, -> { Workspace.find(params[:workspace_id]) }
  expose :member, -> { Membership.find_by!(workspace: workspace, user_id: params[:id]) }
  expose :members, -> { workspace.memberships.includes(:user) }

  def index
    @members = workspace.memberships.includes(:user)
  end

  def update
    authorize member
    
    if member.role == params[:role]
      render json: { message: "User already has this role" }, status: :ok
    elsif member.update(role: params[:role])
      render json: { message: "Role updated successfully" }, status: :ok
    else
      render json: { error: 'Failed to update role' }, status: :unprocessable_entity
    end
  rescue Pundit::NotAuthorizedError => e
    render json: { error: policy(member).update_member_error_message }, status: :forbidden
  end

  def destroy
    authorize member
    
    render json: { message: 'Successfully removed' }, status: :ok if member.destroy
  rescue Pundit::NotAuthorizedError => e
    render json: { error: policy(member).destroy_member_error_message }, status: :forbidden
  end
end
