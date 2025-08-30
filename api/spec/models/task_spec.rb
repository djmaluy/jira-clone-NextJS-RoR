RSpec.describe Task, type: :model do
  it { should belong_to(:workspace) }
  it { should belong_to(:project) }
  it { should belong_to(:assignee).class_name("User").with_foreign_key("assignee_id") }

  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:status) }
  it { should validate_presence_of(:workspace_id) }
  it { should validate_presence_of(:project_id) }
  it { should validate_presence_of(:assignee_id) }

  it { should define_enum_for(:status) }

  let!(:workspace) { create(:workspace) }
  let!(:project1)  { create(:project, workspace: workspace) }
  let!(:project2)  { create(:project, workspace: workspace) }
  let!(:assignee1) { create(:user) }
  let!(:assignee2) { create(:user) }
  let!(:task1) { create(:task, project: project1, status: :todo, assignee: assignee1, due_date: Date.today) }
  let!(:task2) { create(:task, project: project2, status: :done, assignee: assignee2, due_date: Date.tomorrow) }

  it "by project" do
    expect(Task.by_project(project1.id)).to contain_exactly(task1)
  end

  it "by status" do
    expect(Task.by_status(:done)).to contain_exactly(task2)
  end

  it "by assignee" do
    expect(Task.by_assignee(assignee1.id)).to contain_exactly(task1)
  end

  it "by due_date" do
    expect(Task.by_due_date(Date.today)).to contain_exactly(task1)
  end
end
