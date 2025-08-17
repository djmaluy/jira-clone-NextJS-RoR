class WorkspacesController < ApplicationController
  before_action :set_workspace, only: %i[show update]

  def index
    @workspaces = current_user.workspaces
  end

  def create
    workspace = current_user.workspaces.new(workspace_params.except(:image))
    
    if params[:workspace][:image].present?
      workspace.attach_base64_image(:image, params[:workspace][:image])
    end

    if workspace.save
      render json: {id: workspace.id, message: "Successfully created" }, status: :created
    else
      render json: { errors: workspace.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @workspace.update(workspace_params.except(:image))
      if params[:workspace][:image].present?
        @workspace.attach_base64_image(:image, params[:workspace][:image])
      end

      render json: { id: @workspace.id, message: "Successfully updated" }, status: :ok
    else
      render json: { errors: @workspace.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    render :show, formats: :json, status: :ok
  end


  private

  def set_workspace
    @workspace = Workspace.find(params[:id])
  end

  def workspace_params
    params.require(:workspace).permit(:name, :image)
  end
end
