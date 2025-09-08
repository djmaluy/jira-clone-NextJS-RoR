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
      handle_image!
      render :update, formats: :json, status: :ok
    else
      render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
    end
  end


  private

  def handle_image!
    return unless params.key?(:project)

    image_param = params[:project][:image]

    if image_param.present?
      project.attach_base64_image(:image, image_param)
    else
      project.image.purge if project.image.attached?
    end
  end

  def project_params
    params.require(:project).permit(:name, :image)
  end
end
