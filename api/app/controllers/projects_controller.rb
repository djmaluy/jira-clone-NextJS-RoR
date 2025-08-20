class ProjectsController < ApplicationController
  before_action :set_workspace, only: %i[create index]
  before_action :set_project, only: %i[show]

  def create
    @project = @workspace.projects.new(project_params.except(:image))
    
    if params[:project][:image].present?
      @project.attach_base64_image(:image, params[:project][:image])
    end

    if @project.save
      render json: { message: "Successfully created" }, status: :created
    else
      render json: { errors: @project.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def index
    @projects = @workspace.projects
  end

  def show
    render :show, formats: :json, status: :ok
  end

  private

  def set_workspace
    @workspace = Workspace.find(params[:workspace_id])
  end

  def set_project
    @project = Project.find(params[:id])
  end

  def project_params
    params.require(:project).permit(:name, :image)
  end
end
