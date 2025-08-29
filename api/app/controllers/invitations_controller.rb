class InvitationsController < ApplicationController
  expose :workspace, ->{ Workspace.find(params[:workspace_id]) }

  def create
    return render_invalid_code unless valid_invitation_code?
    return render_already_member if user_already_member?
    
    add_member_to_workspace
  end

  def update
    workspace.generate_invitation_code

    if workspace.save
      render json: { invitation_code: workspace.invitation_code }, status: :ok
    else
      render json: { errors: workspace.errors.full_messages }, status: :unprocessable_entity
    end
  end


  private

  def valid_invitation_code?
    workspace.invitation_code == params[:invitation_code]
  end

  def render_invalid_code
    render json: { message: "Invalid invite code" }, status: :unprocessable_entity
  end

  def user_already_member?
    workspace.users.include?(current_user)
  end

  def render_already_member
    render json: { 
      id: workspace.id, 
      message: "You are already a member of this workspace" 
    }, status: :unprocessable_entity
  end

  def add_member_to_workspace
    workspace.users << current_user
    render json: { id: workspace.id, message: "Joined successfully" }, status: :created
  end
end
