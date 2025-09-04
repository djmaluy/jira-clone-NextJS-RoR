class Task < ApplicationRecord
  belongs_to :workspace
  belongs_to :project
  belongs_to :assignee, class_name: "User", foreign_key: "assignee_id"

  enum :status, { backlog: 0, todo: 1, in_progress: 2, in_review: 3, done: 4 }

  validates :name, :status, :workspace_id, :project_id, :assignee_id, presence: true
  validates :position, presence: true, numericality: { greater_than: 0 }

  scope :by_project, ->(project_id) { where(project_id: project_id) if project_id.present? }
  scope :by_status, ->(status) { where(status: status) if status.present? }
  scope :by_assignee, ->(assignee_id) { where(assignee_id: assignee_id) if assignee_id.present? }
  scope :by_due_date, ->(due_date) { where(due_date: due_date) if due_date.present? }

  before_validation :set_default_position, on: :create

  private

  def set_default_position
    return if position.present? && position > 0
    
    last_task = Task.where(status: self.status).order(:position).last
    self.position = last_task ? last_task.position + 65536 : 65536
    
    Rails.logger.info "Setting default position for task: #{self.position}"
  end
end
