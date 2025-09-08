class BaseAnalyticsService
  CURRENT_MONTH_RANGE = Time.current.beginning_of_month..Time.current.end_of_month
  LAST_MONTH_RANGE = 1.month.ago.beginning_of_month..1.month.ago.end_of_month
  DONE_STATUS = Task.statuses[:done]

  def initialize(resource)
    @resource = resource
  end

  def call
    {
      taskCount: current_tasks_count,
      taskDifference: current_tasks_count - last_tasks_count,
      assignedTaskCount: current_assigned_count,
      assignedTaskDifference: current_assigned_count - last_assigned_count,
      completedTaskCount: current_completed_count,
      completedTaskDifference: current_completed_count - last_completed_count,
      incompletedTaskCount: current_incomplete_count,
      incompletedTaskDifference: current_incomplete_count - last_incomplete_count,
      overdueTaskCount: current_overdue_count,
      overdueTaskDifference: current_overdue_count - last_overdue_count
    }
  end

  private

  def current_tasks_count
    @current_tasks_count ||= @resource.tasks.where(created_at: CURRENT_MONTH_RANGE).count
  end

  def last_tasks_count
    @last_tasks_count ||= @resource.tasks.where(created_at: LAST_MONTH_RANGE).count
  end

  def current_assigned_count
    @current_assigned_count ||= @resource.tasks
      .where(created_at: CURRENT_MONTH_RANGE)
      .where.not(assignee_id: nil)
      .count
  end

  def last_assigned_count
    @last_assigned_count ||= @resource.tasks
      .where(created_at: LAST_MONTH_RANGE)
      .where.not(assignee_id: nil)
      .count
  end

  def current_completed_count
    @current_completed_count ||= @resource.tasks
      .where(created_at: CURRENT_MONTH_RANGE, status: DONE_STATUS)
      .count
  end

  def last_completed_count
    @last_completed_count ||= @resource.tasks
      .where(created_at: LAST_MONTH_RANGE, status: DONE_STATUS)
      .count
  end

  def current_incomplete_count
    @current_incomplete_count ||= @resource.tasks
      .where(created_at: CURRENT_MONTH_RANGE)
      .where.not(status: DONE_STATUS)
      .count
  end

  def last_incomplete_count
    @last_incomplete_count ||= @resource.tasks
      .where(created_at: LAST_MONTH_RANGE)
      .where.not(status: DONE_STATUS)
      .count
  end

  def current_overdue_count
    @current_overdue_count ||= @resource.tasks
      .where.not(status: DONE_STATUS)
      .where("due_date IS NOT NULL AND due_date < ?", Time.current)
      .count
  end

  def last_overdue_count
    @last_overdue_count ||= @resource.tasks
      .where.not(status: DONE_STATUS)
      .where("due_date IS NOT NULL AND due_date < ?", 1.month.ago.end_of_month)
      .count
  end
end
