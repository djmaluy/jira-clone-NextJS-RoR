class MembersController < ApplicationController
  before_action :set_workspace
  before_action :set_member, only: [:update, :destroy]
  before_action :workspace_admin, only: [:update, :destroy]
  before_action :prevent_last_member_deletion, only: [:destroy]
  before_action :prevent_last_admin_demotion, only: [:update]

  def index
    @members = @workspace.memberships.includes(:user)
  end

  def update
    if @member.role == params[:role]
      render json: { message: "User already has this role" }, status: :ok
    elsif @member.update(role: params[:role])
      render json: { message: "Role updated successfully" }, status: :ok
    else
      render json: { error: 'Failed to update role' }, status: :unprocessable_entity
    end
  end

  def destroy
    if @member&.destroy
      render json: { message: 'successfully removed' }, status: :no_content
    else
      render json: { error: @member&.errors&.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_workspace
    @workspace = Workspace.find(params[:workspace_id])
  end

  def set_member
    @member = Membership.find_by(workspace: @workspace, user_id: params[:id])
    
    unless @member
      render json: { error: 'Member not found in this workspace' }, status: :not_found
    end
  end

  def workspace_admin
    current_user_membership = current_user.memberships.find_by(workspace: @workspace)
    
    admin_count = @workspace.memberships.where(role: :admin).count
    if admin_count == 0
      return true
    end
    
    unless current_user_membership&.admin?
      render json: { 
        error: 'Access denied. Only workspace admin can manage members.' 
      }, status: :unprocessable_entity
    end
  end

  def prevent_last_member_deletion
    if @workspace.memberships.count <= 1
      render json: { 
        error: 'Cannot remove the last member from workspace' 
      }, status: :unprocessable_entity
      return
    end
  end

  def prevent_last_admin_demotion
    if (@member.admin?) && 
       !['admin'].include?(params[:role]) &&
       @workspace.memberships.where(role: :admin).count <= 1
      
      render json: { 
        error: 'Cannot demote the last admin. Workspace must have at least one admin.' 
      }, status: :unprocessable_entity
    end
  end

  def member_params
    params.permit(:role, :user_id)
  end
end
