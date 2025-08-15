class WorkspacesController < ApplicationController
  def index
    workspaces = current_user.workspaces

    render json: workspaces, status: :ok
  end

  def create
    workspace = current_user.workspaces.new(workspace_params.except(:image))
    
    if params[:workspace][:image].present?
      workspace.attach_base64_image(:image, params[:workspace][:image])
    end

    if workspace.save
      render json: { message: "Successfully created" }, status: :created
    else
      render json: { errors: workspace.errors.full_messages }, status: :unprocessable_entity
    end
  end


  private

  def workspace_params
    params.require(:workspace).permit(:name, :image)
  end
end
