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

    workspace.send(:generate_invitation_code)
    workspace.save!

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
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
    end

    context 'with valid parameters' do
      it 'creates a new workspace' do
        expect {
          post :create, params: valid_params
        }.to change(user.workspaces, :count).by(1)

        expect(response).to have_http_status(:created)
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
        expect(json_response['message']).to eq('Successfully updated')
        expect(json_response['id']).to eq(workspace.id)
      end

      context 'with base64 image' do
        let(:base64_image) { 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' }

        it 'updates image when provided' do
          allow(workspace).to receive(:attach_base64_image)
          allow(Workspace).to receive(:find).and_return(workspace)
          
          put :update, params: { 
            id: workspace.id, 
            workspace: new_attributes.merge(image: base64_image) 
          }, format: :json

          expect(workspace).to have_received(:attach_base64_image).with(:image, base64_image)
        end
      end
    end

    context 'with invalid parameters' do
      let(:invalid_attributes) { { name: '' } }

      it 'returns unprocessable entity status' do
        put :update, params: { id: workspace.id, workspace: invalid_attributes }, format: :json
        expect(response).to have_http_status(:unprocessable_entity)
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

  describe 'PUT #reset_invitation_code' do
    it 'generates new invitation code' do
      old_code = workspace.invitation_code
      put :reset_invitation_code, params: { id: workspace.id }, format: :json
      
      workspace.reload
      expect(workspace.invitation_code).not_to eq(old_code)
    end

    it 'returns new invitation code' do
      put :reset_invitation_code, params: { id: workspace.id }, format: :json
      expect(response).to have_http_status(:ok)
      
      json_response = JSON.parse(response.body)
      expect(json_response['invitation_code']).to eq(workspace.reload.invitation_code)
    end
  end

  describe 'POST #join' do
    before do
      workspace.users.delete(user) if workspace.users.include?(user)
    end

    context 'when invitation code is valid' do
      it 'adds the user to the workspace' do
        put :join, params: { id: workspace.id, invitation_code: workspace.invitation_code }, format: :json

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["message"]).to eq("Joined successfully")
        expect(workspace.reload.users).to include(user)
      end
    end

    context 'when user is already a member' do
      before do
        workspace.users << user
      end

      it 'does not add the user again' do
        expect {
          post :join, params: { id: workspace.id, invitation_code: workspace.invitation_code }, format: :json
        }.not_to change(workspace.users, :count)

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["message"]).to eq("You are already a member of this workspace")
      end
    end

    context 'when invitation code is invalid' do
      it 'returns an error message' do
        post :join, params: { id: workspace.id, invitation_code: "wrong-code" }, format: :json

        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)["message"]).to eq("Invalid invite code")
      end
    end
  end
end
