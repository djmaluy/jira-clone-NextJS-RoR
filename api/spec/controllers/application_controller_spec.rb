require "rails_helper"

RSpec.describe ApplicationController, type: :controller do
  controller do
    def index
      render json: { message: "ok" }
    end
  end

  describe "before_action :authenticate_user" do
    context "when user is not authenticated" do
      it "returns unauthorized" do
        get :index
        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)["error"]).to eq("Unauthorized")
      end
    end

    context "when user is authenticated" do
      before do
        allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(build_stubbed(:user))
      end

      it "allows request" do
        get :index
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["message"]).to eq("ok")
      end
    end
  end
end
