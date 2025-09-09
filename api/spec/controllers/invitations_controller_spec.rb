RSpec.describe InvitationsController, type: :controller do
  let(:user) { create(:user) }
  let!(:workspace) { create(:workspace, name: 'Demo workspace') }
  let(:invalid_params) { { workspace_id: workspace.id, invitation_code: 'invalid_code' } }
  let(:valid_params) do
    { workspace_id: workspace.id, invitation_code: workspace.reload.invitation_code }
  end

  before do
    workspace.generate_invitation_code
    allow(controller).to receive(:current_user).and_return(user)
  end

  describe 'PUT #update' do
    it 'generates new invitation code' do
      prev_code = workspace.invitation_code
      put :update, params: { workspace_id: workspace.id }, format: :json

      workspace.reload
      expect(workspace.invitation_code).not_to eq(prev_code)
    end

    it "returns new invitation code" do
      put :update, params: { workspace_id: workspace.id }, format: :json
      expect(response).to have_http_status(:ok)

      json_respose = JSON.parse(response.body)
      expect(json_respose['invitation_code']).to eq(workspace.reload.invitation_code)
    end

    context "when save fails" do
      before do
        allow_any_instance_of(Workspace).to receive(:save).and_return(false)
        allow_any_instance_of(Workspace).to receive_message_chain(:errors, :full_messages).and_return(["Something went wrong"])
      end

      it "returns unprocessable_entity with errors" do
        put :update, params: { workspace_id: workspace.id }, format: :json

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response["errors"]).to include("Something went wrong")
      end
    end
  end

  describe 'POST #create' do
    before do
      workspace.users.delete(user) if workspace.users.include?(user)
    end

    context 'when invitation code is valid' do
      it 'adds new user and returns success message' do
        expect {
          post :create, params: valid_params, format: :json
        }.to change { workspace.reload.users.count }.by(1)

        json_response = JSON.parse(response.body)
        expect(json_response['message']).to eq('Joined successfully')
        expect(json_response['id']).to eq(workspace.id)
      end
    end

    context 'when user is already a member' do
      before do
        workspace.generate_invitation_code
        workspace.save!
        workspace.users << user
      end

      it 'returns already member message' do
        post :create, params: valid_params, format: :json

        expect(response).to have_http_status(:unprocessable_entity)
        
        json_response = JSON.parse(response.body)
        expect(json_response['message']).to eq('You are already a member of this workspace')
        expect(json_response['id']).to eq(workspace.id)
      end

      it 'does not add user again' do
        expect {
          post :create, params: valid_params, format: :json
        }.not_to change { workspace.reload.users.count }
      end
    end

    context 'when invitation code is invalid' do
      it 'returns unprocessable entity status' do
        post :create, params: invalid_params, format: :json

        expect(response).to have_http_status(:unprocessable_entity)
        
        json_response = JSON.parse(response.body)
        expect(json_response['message']).to eq('Invalid invite code')
      end

      it 'does not add user to workspace' do
        expect {
          post :create, params: invalid_params, format: :json
        }.not_to change { workspace.reload.users.count }
      end
    end
  end
end
