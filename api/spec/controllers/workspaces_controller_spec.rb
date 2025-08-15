RSpec.describe WorkspacesController, type: :controller do
  let(:user) { create(:user) }
  let!(:workspace1) { create(:workspace, user: user, name: 'First Workspace') }
  let!(:workspace2) { create(:workspace, user: user, name: 'Second Workspace') }
  let(:other_user) { create(:user) }
  let!(:other_workspace) { create(:workspace, user: other_user, name: 'Other Workspace') }
  
  before do
    allow(controller).to receive(:current_user).and_return(user)
  end

  describe 'GET #index' do
    context 'when user is authenticated' do
      it 'returns user workspaces' do
        get :index

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response.length).to eq(2)
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

      it 'returns validation errors' do
        post :create, params: invalid_params

        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to be_present
        expect(json_response['errors']).to include("Name can't be blank")
      end
    end
  end
end
