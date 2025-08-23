class TasksController < ApplicationController
   def index
    @tasks = Task
    .where(workspace_id: params[:workspace_id])
    .by_assignee(params[:assignee_id])
    .by_project(params[:project_id])
    .by_status(params[:status])
    .by_due_date(params[:due_date])
   end

  def create
    @task = Task.new(task_params.merge(workspace_id: params[:workspace_id]))

    if @task.save
      render json: { 
                    id: @task.id,
                    workspaceId: @task.workspace.id,
                    message: "Successfully created" 
                    }, status: :created
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def task_params
    params.require(:task).permit(:name, :due_date, :assignee_id, :status, :project_id)
  end
end
