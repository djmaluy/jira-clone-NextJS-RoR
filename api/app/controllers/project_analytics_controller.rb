class ProjectAnalyticsController < ApplicationController
  expose :workspace, ->{ current_user.workspaces.find(params[:workspace_id]) }
  expose :project, ->{ workspace.projects.find(params[:project_id]) }

  def show
    analytics = ProjectAnalyticsService.new(project).call
    render json: analytics, status: :ok
  rescue => e
    render json: { error: 'Analytics calculation failed' }, status: :unprocessable_entity
  end
end
