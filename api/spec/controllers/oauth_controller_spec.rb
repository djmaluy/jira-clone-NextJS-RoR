RSpec.describe OauthController, type: :controller do
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
