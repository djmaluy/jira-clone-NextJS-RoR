json.tasks do
  Task.statuses.keys.each do |status|
    json.set! status do
      json.array! tasks.select { |t| t.status == status }.sort_by(&:position) do |task|
        json.id task.id
        json.name task.name
        json.status task.status
        json.position task.position
        json.workspaceId task.workspace_id
        json.projectId task.project_id
        json.projectName task.project.name
        json.assigneeId task.assignee_id
        json.assigneeName task.assignee.name
        json.description task.description
        json.projectImg task.project.image_url
        json.dueDate task.due_date
      end
    end
  end
end
