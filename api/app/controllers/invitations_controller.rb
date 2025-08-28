class InvitationsController < ApplicationController
  before_action :set_workspace

  def create
    if @workspace.invitation_code == params[:invitation_code]
      if @workspace.users.include?(current_user)
        render json: { 
          id: @workspace.id, 
          message: "You are already a member of this workspace" 
        }, status: :ok
      else
        @workspace.users << current_user
        render json: { 
          id: @workspace.id, 
          message: "Joined successfully" 
        }, status: :created
      end
    else
      render json: { message: "Invalid invite code" }, status: :unauthorized
    end
  end

  def update
    @workspace.send(:generate_invitation_code)

    if @workspace.save
      render json: { invitation_code: @workspace.invitation_code }, status: :ok
    else
      render json: { errors: @workspace.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_workspace
    @workspace = Workspace.find(params[:workspace_id])
  end
end
