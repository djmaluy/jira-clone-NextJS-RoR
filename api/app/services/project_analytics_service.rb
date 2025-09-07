class ProjectAnalyticsService
  def initialize(project)
    @project = project
    @tasks = @project.tasks
  end

  def call
    {
      taskCount: current_month_tasks.size,
      taskDifference: task_difference,
      assignedTaskCount: current_month_tasks.where.not(assignee_id: nil).size,
      assignedTaskDifference: assigned_task_difference,
      incompletedTaskCount: current_month_tasks.where.not(status: :done).size,
      incompletedTaskDifference: incompleted_task_difference,
      completedTaskCount: current_month_tasks.where(status: :done).size,
      completedTaskDifference: completed_task_difference,
      overdueTaskCount: current_month_tasks.where("due_date < ?", Time.current).where.not(status: :done).size,
      overdueTaskDifference: overdue_task_difference
    }
  end


  private

  def current_month_tasks
    @tasks.where(created_at: Time.current.beginning_of_month..Time.current.end_of_month)
  end

  def last_month_tasks
    @tasks.where(created_at: 1.month.ago.beginning_of_month..1.month.ago.end_of_month)
  end

  def task_difference
    current_month_tasks.size - last_month_tasks.size
  end

  def assigned_task_difference
    current_month_tasks.where.not(assignee_id: nil).size -
      last_month_tasks.where.not(assignee_id: nil).size
  end

  def completed_task_difference
    current_month_tasks.where(status: :done).size -
      last_month_tasks.where(status: :done).size
  end

  def incompleted_task_difference
    current_month_tasks.where.not(status: :done).size -
      last_month_tasks.where.not(status: :done).size
  end

  def overdue_task_difference
    current_month_tasks
      .where("due_date < ?", Time.current)
      .where.not(status: :done)
      .count -
    last_month_tasks
      .where("due_date < ?", Time.current)
      .where.not(status: :done)
      .count
  end
end
