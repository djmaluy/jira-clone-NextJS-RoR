RSpec.describe WorkspacesController, type: :controller do
  let(:user) { create(:user) }
  let(:second_user) { create(:user) }
  let!(:workspace) { create(:workspace, name: 'First Workspace') }
  let!(:workspace2) { create(:workspace, name: 'Second Workspace') }
  let!(:other_workspace) { create(:workspace, name: 'Other Workspace') }
  
  before do
    create(:membership, user: user, workspace: workspace, role: :admin)
    create(:membership, user: user, workspace: workspace2, role: :admin)
    create(:membership, user: second_user, workspace: other_workspace, role: :admin)

    allow(controller).to receive(:current_user).and_return(user)
  end

  describe 'GET #index' do
    context 'when user is authenticated' do
      it 'returns user workspaces' do
        get :index, format: :json

        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe 'POST #create' do
    let(:valid_params) do
      { workspace: { name: 'New Workspace' } }
    end

    let(:invalid_params) do
      { workspace: { name: '' } }
    end

    let(:base64_image) do
      'data:image/png;base64,iVBORw0KGgoAAAAPchI7wAAAABJRU5ErkJggg=='
    end

    context 'with valid parameters' do
      it 'creates a new workspace' do
        expect {
          post :create, params: valid_params
        }.to change(user.workspaces, :count).by(1)

        expect(response).to have_http_status(:created)
      end

      it 'creates membership with admin role' do
        expect {
          post :create, params: valid_params
        }.to change(user.memberships, :count).by(1)

        created_membership = user.memberships.last
        expect(created_membership.role).to eq("admin")
      end

      it 'returns workspace id in response' do
        post :create, params: valid_params
        
        json_response = JSON.parse(response.body)
        expect(json_response['id']).to be_present
        expect(json_response['id']).to eq(Workspace.first.id)
      end
    end

    context 'with Base64 image' do
      let(:params_with_image) do
        { workspace: { name: 'Workspace with Image', image: base64_image } }
      end

      it 'creates workspace and attaches image' do
        expect {
          post :create, params: params_with_image
        }.to change(user.workspaces, :count).by(1)

        expect(response).to have_http_status(:created)
        
        created_workspace = user.workspaces.first
        expect(created_workspace.image.attached?).to be_truthy
      end
    end

    context 'with invalid parameters' do
      it 'does not create workspace' do
        expect {
          post :create, params: invalid_params
        }.not_to change(user.workspaces, :count)

        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns validation errors' do
        post :create, params: invalid_params
        
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to be_present
      end
    end
  end

  describe 'GET #show' do
    it 'returns the workspace' do
      get :show, params: { id: workspace.id }, format: :json

      expect(response).to have_http_status(:ok)
    end

    it 'returns error for non-existent workspace' do
      expect {
        get :show, params: { id: 99999 }, format: :json
      }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end

  describe 'PUT #update' do
    context 'with valid parameters' do
      let(:new_attributes) { { name: 'Updated Workspace' } }

      it 'updates the workspace' do
        put :update, params: { id: workspace.id, workspace: new_attributes }, format: :json
        workspace.reload
        expect(workspace.name).to eq('Updated Workspace')
      end

      it 'returns success response' do
        put :update, params: { id: workspace.id, workspace: new_attributes }, format: :json
        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['id']).to eq(workspace.id)
      end
    end

    context 'with base64 image' do
      let(:image_data) { "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" }

      it "attaches new image" do
        expect_any_instance_of(Workspace).to receive(:attach_base64_image).with(:image, image_data)

        patch :update, params: {
          id: workspace.id,
          workspace: { image: image_data }
        }, format: :json
      end
    end

    context 'with invalid parameters' do
      let(:invalid_attributes) { { name: '' } }

      it 'returns unprocessable entity status' do
        put :update, params: { id: workspace.id, workspace: invalid_attributes }, format: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns validation errors' do
        put :update, params: { id: workspace.id, workspace: invalid_attributes }, format: :json
        
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to be_present
      end
    end
  end

  describe 'DELETE #destroy' do
    it 'destroys the workspace' do
      expect {
        delete :destroy, params: { id: workspace.id }, format: :json
      }.to change(Workspace, :count).by(-1)
    end

    it 'returns no content status' do
      delete :destroy, params: { id: workspace.id }, format: :json
      expect(response).to have_http_status(:no_content)
    end
  end
end
