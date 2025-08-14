require 'rails_helper'

RSpec.describe AuthController, type: :controller do
  let(:user) { create(:user) }
  let(:valid_user_params) { { user: { email: 'test@example.com', password: 'password123', name: 'Test User' } } }
  let(:invalid_user_params) { { user: { email: '', password: '', name: '' } } }

  describe 'POST #sign_up' do
    context 'with valid parameters' do
      it 'creates a new user' do
        expect {
          post :sign_up, params: valid_user_params
        }.to change(User, :count).by(1)
      end

      it 'returns success message with created status' do
        post :sign_up, params: valid_user_params
        
        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)['message']).to eq('Successfully created')
      end
    end

    context 'with invalid parameters' do
      it 'does not create a user' do
        expect {
          post :sign_up, params: invalid_user_params
        }.not_to change(User, :count)
      end

      it 'returns validation errors with unprocessable_entity status' do
        post :sign_up, params: invalid_user_params
        
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)).to have_key('errors')
      end
    end

    context 'when email already exists' do
      before { create(:user, email: 'test@example.com') }

      it 'returns validation error for duplicate email' do
        post :sign_up, params: valid_user_params
        
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)['errors']).to have_key('email')
      end
    end
  end
end