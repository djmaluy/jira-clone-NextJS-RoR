require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  let(:user) { create(:user) }
  let(:valid_user_params) { { user: { email: 'test@example.com', password: 'password123', name: 'Test User' } } }
  let(:invalid_user_params) { { user: { email: '', password: '', name: '' } } }

  describe 'POST #create' do
    context 'with valid parameters' do
      it 'creates a new user' do
        expect {
          post :create, params: valid_user_params
        }.to change(User, :count).by(1)
      end

      it 'returns success message with created status' do
        post :create, params: valid_user_params

        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)['message']).to eq('Successfully created')
      end
    end

    context 'with invalid parameters' do
      it 'does not create a user' do
        expect {
          post :create, params: invalid_user_params
        }.not_to change(User, :count)
      end

      it 'returns validation errors with unprocessable_entity status' do
        post :create, params: invalid_user_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)).to have_key('errors')
      end
    end

    context 'when email already exists' do
      before { create(:user, email: 'test@example.com') }

      it 'returns validation error for duplicate email' do
        post :create, params: valid_user_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)['errors']).to have_key('email')
      end
    end
  end

  describe 'GET #confirm_email' do
    let!(:user) { create(:user, confirm_token: "123456qwerty", email_confirmed: false) }

    before do
      stub_const("ENV", ENV.to_hash.merge("FRONTEND_URL" => "http://test.host"))
    end

    context 'when token is valid' do
      it 'confirms the user email and redirects to frontend' do
        get :confirm_email, params: { token: "123456qwerty" }

        user.reload
        expect(user.confirm_token).to be_nil
        expect(user.email_confirmed).to be true
        expect(response).to redirect_to("#{ENV['FRONTEND_URL']}/sign-in")
      end
    end
    
    context 'when token is invalid' do
      it 'renders error json' do
        get :confirm_email, params: { token: "wrongtoken" }

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["errors"]).to be_present
      end
    end
  end
end
