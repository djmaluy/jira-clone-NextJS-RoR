class ProjectAnalyticsService
  CURRENT_MONTH_RANGE = Time.current.beginning_of_month..Time.current.end_of_month
  LAST_MONTH_RANGE = 1.month.ago.beginning_of_month..1.month.ago.end_of_month
  DONE_STATUS = Task.statuses[:done]

  def initialize(project)
    @project = project
  end

  def call
    {
      taskCount: current_tasks.count,
      taskDifference: current_tasks.count - last_tasks.count,
      assignedTaskCount: current_assigned_tasks.count,
      assignedTaskDifference: current_assigned_tasks.count - last_assigned_tasks.count,
      incompletedTaskCount: current_incomplete_tasks.count,
      incompletedTaskDifference: current_incomplete_tasks.count - last_incomplete_tasks.count,
      completedTaskCount: current_completed_tasks.count,
      completedTaskDifference: current_completed_tasks.count - last_completed_tasks.count,
      overdueTaskCount: current_overdue_tasks.count,
      overdueTaskDifference: current_overdue_tasks.count - last_overdue_tasks.count
    }
  end

  private

  def current_tasks
    @current_tasks ||= @project.tasks.where(created_at: CURRENT_MONTH_RANGE)
  end

  def last_tasks
    @last_tasks ||= @project.tasks.where(created_at: LAST_MONTH_RANGE)
  end

  def current_assigned_tasks
    @current_assigned_tasks ||= current_tasks.where.not(assignee_id: nil)
  end

  def last_assigned_tasks
    @last_assigned_tasks ||= last_tasks.where.not(assignee_id: nil)
  end

  def current_completed_tasks
    @current_completed_tasks ||= current_tasks.where(status: DONE_STATUS)
  end

  def last_completed_tasks
    @last_completed_tasks ||= last_tasks.where(status: DONE_STATUS)
  end

  def current_incomplete_tasks
    @current_incomplete_tasks ||= current_tasks.where.not(status: DONE_STATUS)
  end

  def last_incomplete_tasks
    @last_incomplete_tasks ||= last_tasks.where.not(status: DONE_STATUS)
  end

  def current_overdue_tasks
    @current_overdue_tasks ||= current_tasks
      .where.not(status: DONE_STATUS)
      .where("due_date IS NOT NULL AND due_date < ?", Time.current)
  end

  def last_overdue_tasks
    @last_overdue_tasks ||= last_tasks
      .where.not(status: DONE_STATUS)
      .where("due_date IS NOT NULL AND due_date < ?", 1.month.ago.end_of_month)
  end
end
