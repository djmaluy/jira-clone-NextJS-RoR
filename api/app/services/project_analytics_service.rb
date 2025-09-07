class ProjectAnalyticsService
  CURRENT_MONTH_RANGE = Time.current.beginning_of_month..Time.current.end_of_month
  LAST_MONTH_RANGE = 1.month.ago.beginning_of_month..1.month.ago.end_of_month

  def initialize(project)
    @project = project
  end

  def call
    {
      taskCount: current_tasks.size,
      taskDifference: current_tasks.size - last_tasks.size,
      assignedTaskCount: current_assigned_tasks.size,
      assignedTaskDifference: current_assigned_tasks.size - last_assigned_tasks.size,
      incompletedTaskCount: current_incomplete_tasks.size,
      incompletedTaskDifference: current_incomplete_tasks.size - last_incomplete_tasks.size,
      completedTaskCount: current_completed_tasks.size,
      completedTaskDifference: current_completed_tasks.size - last_completed_tasks.size,
      overdueTaskCount: current_overdue_tasks.size,
      overdueTaskDifference: current_overdue_tasks.size - last_overdue_tasks.size
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
    @current_assigned_tasks ||= current_tasks.select { |t| t.assignee_id.present? }
  end

  def last_assigned_tasks
    @last_assigned_tasks ||= last_tasks.select { |t| t.assignee_id.present? }
  end

  def current_completed_tasks
    @current_completed_tasks ||= current_tasks.select { |t| t.status == 'done' }
  end

  def last_completed_tasks
    @last_completed_tasks ||= last_tasks.select { |t| t.status == 'done' }
  end

  def current_incomplete_tasks
    @current_incomplete_tasks ||= current_tasks.select { |t| t.status != 'done' }
  end

  def last_incomplete_tasks
    @last_incomplete_tasks ||= last_tasks.select { |t| t.status != 'done' }
  end

  def current_overdue_tasks
    @current_overdue_tasks ||= current_tasks.select do |t|
      t.due_date.present? && t.due_date < Time.current && t.status != 'done'
    end
  end

  def last_overdue_tasks
    @last_overdue_tasks ||= last_tasks.select do |t|
      t.due_date.present? && t.due_date < 1.month.ago.end_of_month && t.status != 'done'
    end
  end
end
