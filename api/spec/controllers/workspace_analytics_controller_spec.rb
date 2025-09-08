RSpec.describe WorkspaceAnalyticsController, type: :controller do
  let(:user) { create(:user) }
  let!(:workspace) { create(:workspace) }
  let!(:project) { create(:project, workspace: workspace) }
  let!(:user_membership) { create(:membership, :admin, user: user, workspace: workspace) }

  before do
    allow(controller).to receive(:current_user).and_return(user)
  end

  describe "GET #show" do
    it "returns success" do
      
      get :show, params: { workspace_id: workspace.id }, format: :json
      expect(response).to have_http_status(:ok)
    end

    it "returns error" do 
      other_workspace = create(:workspace)

      get :show, params: { workspace_id: other_workspace.id }, format: :json
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
