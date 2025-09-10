RSpec.describe OauthController, type: :controller do
  describe "GET #github" do
    it "redirects to GitHub OAuth URL with correct params" do
      allow(SecureRandom).to receive(:hex).and_return("randomstate")

      get :github

      expect(response).to have_http_status(:redirect)
      expect(response).to redirect_to(
        "https://github.com/login/oauth/authorize?" +
        {
          client_id: ENV['GITHUB_CLIENT_ID'],
          redirect_uri: "#{ENV['BACKEND_URL']}/api/oauth/github_callback",
          state: "randomstate"
        }.to_query
      )
    end
  end

  describe "GET #github_callback" do
    let(:user) { create(:user) }

    context "when authentication succeeds" do
      it "sets JWT cookie and redirects to frontend" do
        service = double('GithubOauthService')
        allow(GithubOauthService).to receive(:new).with("authcode").and_return(service)
        allow(service).to receive(:authenticate).and_return(user)
        allow(JwtCookieService).to receive(:set_cookie)

        get :github_callback, params: { code: "authcode" }
        expect(JwtCookieService).to have_received(:set_cookie).with(anything, user)
      end
    end
  end
end
