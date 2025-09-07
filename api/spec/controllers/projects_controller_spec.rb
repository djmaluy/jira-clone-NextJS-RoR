require "rails_helper"

RSpec.describe ProjectsController, type: :controller do
  let(:user) { create(:user) }
  let!(:workspace) { create(:workspace) }
  let!(:project) { create(:project, workspace: workspace) }

  before do
    allow(controller).to receive(:current_user).and_return(user)
  end

  describe "GET #index" do
    it "returns success" do
      get :index, params: { workspace_id: workspace.id }, format: :json
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET #show" do
    it "returns success" do
      get :show, params: { workspace_id: workspace.id, id: project.id }, format: :json
      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST #create" do
    context "with valid params" do
      let(:valid_params) do
        {
          workspace_id: workspace.id,
          project: { name: "New Project" }
        }
      end

      it "creates a new project" do
        expect {
          post :create, params: valid_params, format: :json
        }.to change(Project, :count).by(1)

        expect(response).to have_http_status(:created)
      end
    end

    context "with invalid params" do
      let(:invalid_params) do
        {
          workspace_id: workspace.id,
          project: { name: "" }
        }
      end

      it "returns errors" do
        expect {
          post :create, params: invalid_params, format: :json
        }.not_to change(Project, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)["errors"]).to include("Name can't be blank")
      end
    end

    context "with base64 image" do
      let(:image_data) { "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" }

      it "calls attach_base64_image" do
        expect_any_instance_of(Project).to receive(:attach_base64_image).with(:image, image_data)

        post :create, params: {
          workspace_id: workspace.id,
          project: {
            name: "With Image",
            image: image_data
          }
        }, format: :json
      end
    end
  end

  describe "PATCH #update" do
    context "with valid params" do
      it "updates the project" do
        patch :update, params: {
          workspace_id: workspace.id,
          id: project.id,
          project: { name: "Updated Name" }
        }, format: :json

        expect(response).to have_http_status(:ok)
        expect(project.reload.name).to eq("Updated Name")
      end
    end

    context "with invalid params" do
      it "returns errors" do
        patch :update, params: {
          workspace_id: workspace.id,
          id: project.id,
          project: { name: "" }
        }, format: :json

        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)["errors"]).to include("Name can't be blank")
      end
    end

    context "with new base64 image" do
      let(:image_data) { "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" }

      it "attaches new image" do
        expect_any_instance_of(Project).to receive(:attach_base64_image).with(:image, image_data)

        patch :update, params: {
          workspace_id: workspace.id,
          id: project.id,
          project: { image: image_data }
        }, format: :json
      end
    end
  end
end
