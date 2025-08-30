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
  
  describe "POST #login" do
    let!(:user) { create(:user, password: "password123") }

    context "with valid credentials" do
      it "logs in the user and sets JWT cookie" do
        expect(JwtCookieService).to receive(:set_cookie).with(anything, user)

        post :login, params: {
          email: user.email,
          password: "password123"
        }

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)).to eq(
          { "message" => "Logged in successfully" }
        )
      end
    end

    context "with invalid credentials" do
      it "returns unauthorized with wrong password" do
        post :login, params: {
          email: user.email,
          password: "wrong_password"
        }

        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)).to eq(
          { "error" => "Invalid credentials" }
        )
      end
    end
  end

  describe "GET #current" do
    context "when user is logged in" do
      before do
        allow(controller).to receive(:current_user).and_return(user)
      end

      it "returns current user info" do
        get :current
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["id"]).to eq(user.id)
        expect(json["email"]).to eq(user.email)
        expect(json["name"]).to eq(user.name)
      end
    end

    context "when no user is logged in" do
      before do
        allow(controller).to receive(:authenticate_user).and_return(true)
        allow(controller).to receive(:current_user).and_return(nil)
      end

      it "returns unauthorized" do
        get :current
        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)).to eq({ "error" => "Unauthorized" })
      end
    end
  end

  describe "DELETE #logout" do
    it "clears the JWT cookie and returns no_content" do
      expect(JwtCookieService).to receive(:clear_cookie).with(anything)

      delete :logout
      expect(response).to have_http_status(:no_content)
    end
  end
end
