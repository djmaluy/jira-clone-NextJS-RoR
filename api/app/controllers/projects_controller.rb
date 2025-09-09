class ProjectsController < ApplicationController
  expose :workspace, ->{ Workspace.find(params[:workspace_id]) }
  expose :projects, ->{ workspace.projects.includes([:image_attachment]) }
  expose :project, ->{
    if params[:id]
      workspace.projects.find(params[:id])
    else
      workspace.projects.new(project_params.except(:image))
    end
  }

  def index
  end

  def show
  end

  def create    
    if params[:project][:image].present?
      project.attach_base64_image(:image, params[:project][:image])
    end

    if project.save
      render :create, formats: :json, status: :created
    else
      render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if project.update(project_params.except(:image))
      if params[:project][:image].present?
        project.attach_base64_image(:image, params[:project][:image])
      end
      render :update, formats: :json, status: :ok
    else
      render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
    end
  end


  private

  def project_params
    params.require(:project).permit(:name, :image)
  end
end
