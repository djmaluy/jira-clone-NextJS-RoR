class WorkspacesController < ApplicationController
  def create
    workspace = current_user.workspaces.new(workspace_params)

    if workspace.save
      render json: { id: workspace.id, name: workspace.name }, status: :created
    else
      render json: { errors: workspace.errors.full_messages }, status: :unprocessable_entity
    end
  end


  private

  def workspace_params
    params.require(:workspace).permit(:name)
  end
end
