class TasksController < ApplicationController
  before_action :set_task, only: %i[destroy show update]

  def index
    @tasks = Task
    .where(workspace_id: params[:workspace_id])
    .by_assignee(params[:assignee_id])
    .by_project(params[:project_id])
    .by_status(params[:status])
    .by_due_date(params[:due_date])
  end

  def show
    render :show, formats: :json, status: :ok
  end

  def create
    @task = Task.new(task_params)

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

 def update
  if @task.update(task_params)
    render json: { 
      id: @task.id,
      message: "Successfully updated"
    }, status: :ok
  else
    render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
  end
 end

  def destroy
    @task.destroy
    head :no_content
  end

  private

  def set_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:name, :due_date, :assignee_id, :status, :project_id, :workspace_id)
  end
end
