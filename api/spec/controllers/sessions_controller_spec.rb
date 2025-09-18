require 'rails_helper'

RSpec.describe SessionsController, type: :controller do
  let(:user) { create(:user) }
  let(:valid_user_params) { { user: { email: 'test@example.com', password: 'password123', name: 'Test User' } } }
  let(:invalid_user_params) { { user: { email: '', password: '', name: '' } } }

  describe "POST #create" do
    let!(:user) { create(:user, password: "password123") }

    context "with valid credentials" do
      it "logs in the user and sets JWT cookie" do
        expect(JwtCookieService).to receive(:set_cookie).with(anything, user)

        post :create, params: {
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
        post :create, params: {
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

  describe "GET #show" do
    context "when user is logged in" do
      before do
        allow(controller).to receive(:current_user).and_return(user)
      end

      it "returns current user info" do
        get :show
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
        get :show
        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)).to eq({ "error" => "Unauthorized" })
      end
    end
  end

  describe "DELETE #destroy" do
    it "clears the JWT cookie and returns no_content" do
      expect(JwtCookieService).to receive(:clear_cookie).with(anything)

      delete :destroy
      expect(response).to have_http_status(:no_content)
    end
  end
end