require 'rails_helper'

RSpec.describe TasksController, type: :controller do
  let(:user) { create(:user) }
  let!(:workspace) { create(:workspace) }
  let!(:project)   { create(:project, workspace: workspace) }
  let(:task) { create(:task) }

  before do
    allow(controller).to receive(:current_user).and_return(user)
  end

  describe "GET #index" do
    it "returns success" do
      get :index, params: { id: workspace.id }, format: :json

      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET #show" do
    it "returns success" do
      get :show, params: { id: task.id }, format: :json

      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST #create" do
    context "with valid params" do
      let(:valid_params) do
        {
          task: {
            workspace_id: workspace.id,
            project_id: project.id,
            due_date: Date.today + 7.days,
            status: :todo,
            assignee_id: user.id,
            name: "test task"
          }
        }
      end

      it "creates a new task" do
        expect {
          post :create, params: valid_params, format: :json
        }.to change(Task, :count).by(1)

        expect(response).to have_http_status(:created)
      end
    end

    context "with invalid params" do
      let(:invalid_params) do
        {
          task: {
            workspace_id: nil,
            project_id: nil,
            due_date: Date.today + 7.days,
            status: :todo,
            assignee_id: user.id,
            name: ""
          }
        }
      end

      it "returns errors" do
        expect {
          post :create, params: invalid_params, format: :json
        }.not_to change(Task, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)["errors"]).to include("Name can't be blank")
      end
    end
  end

  describe "PATCH #update" do
    context "with valid params" do
      let(:valid_params) do
        {
          id: task.id,
          task: {
            workspace_id: workspace.id,
            project_id: project.id,
            due_date: Date.today + 8.days,
            status: :todo,
            assignee_id: user.id,
            name: "Updated test task name"
          }
        }
      end

      it "updates current task" do
        patch :update, params: valid_params, format: :json
       
        expect(task.reload.name).to eq("Updated test task name")
        expect(response).to have_http_status(:ok)
      end
    end

    context "with invalid params" do
      let(:invalid_params) do
        {
          id: task.id,
          task: {
            workspace_id: nil,
            project_id: nil,
            due_date: Date.today + 7.days,
            status: :todo,
            assignee_id: user.id,
            name: ""
          }
        }
      end

      it "returns errors" do
        patch :update, params: invalid_params, format: :json
      
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)["errors"]).to include("Name can't be blank")
      end
    end
  end

  describe 'DELETE #destroy' do
    let!(:task_to_delete) { create(:task) }

    context "destroys the task" do
      it 'returns no_content status' do
        expect {
          delete :destroy, params: { id: task_to_delete.id }, format: :json
        }.to change(Task, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end
  end
end
