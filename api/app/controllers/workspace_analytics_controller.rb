class WorkspaceAnalyticsController < ApplicationController
  expose :workspace, ->{ current_user.workspaces.find(params[:workspace_id]) }

  def show
       
    analytics = BaseAnalyticsService.new(workspace).call
    render json: analytics, status: :ok
  rescue => e
    render json: { error: 'Analytics calculation failed' }, status: :unprocessable_entity
  end
end
