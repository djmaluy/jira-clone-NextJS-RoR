class TasksController < ApplicationController
  expose :task, ->{ params[:id] ? Task.find(params[:id]) : Task.new(task_params) }
  expose :tasks, ->{
    Task.where(workspace_id: params[:workspace_id])
        .by_assignee(params[:assignee_id])
        .by_project(params[:project_id])
        .by_status(params[:status])
        .by_due_date(params[:due_date])
  }

  def index
  end

  def show
  end

  def create
    if task.save
      render :create, formats: :json, status: :created
    else
      render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if task.update(task_params)
      render json: { id: task.id }, status: :ok
    else
      render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    task.destroy
    head :no_content
  end

  private

  def task_params
    params.require(:task).permit(:name, :due_date, :assignee_id, :status, :project_id, :workspace_id)
  end
end
