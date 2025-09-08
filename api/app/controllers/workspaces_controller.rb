class WorkspacesController < ApplicationController
  expose :workspaces, ->{ current_user.workspaces.includes([:image_attachment]) }
  expose :workspace, ->{
    if params[:id]
      Workspace.includes([:tasks]).find(params[:id])
    else
      Workspace.new(workspace_params.except(:image))
    end
  }

  def index
  end

  def show
    raise ActiveRecord::RecordNotFound unless workspace
  end

  def create    
    if params[:workspace][:image].present?
      workspace.attach_base64_image(:image, params[:workspace][:image])
    end

    if workspace.save
      Membership.create!(user: current_user, workspace: workspace, role: :admin)
      render json: { id: workspace.id }, status: :created
    else
      render json: { errors: workspace.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if workspace.update(workspace_params.except(:image))
      if params[:workspace][:image].present?
        workspace.attach_base64_image(:image, params[:workspace][:image])
      end

      render json: { id: workspace.id }, status: :ok
    else
      render json: { errors: workspace.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    render json: { message: 'Successfully deleted' }, status: :no_content if workspace.destroy
  end


  private

  def workspace_params
    params.require(:workspace).permit(:name, :image, :invitation_code)
  end
end
