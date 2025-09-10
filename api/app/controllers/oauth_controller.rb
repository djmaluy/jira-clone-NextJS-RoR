class OauthController < ApplicationController
  skip_before_action :authenticate_user

  def github
    github_url = "https://github.com/login/oauth/authorize?" + {
      client_id: ENV['GITHUB_CLIENT_ID'],
      redirect_uri: "#{ENV['BACKEND_URL']}/api/oauth/github_callback",
      state: SecureRandom.hex(16)
    }.to_query

    redirect_to github_url, allow_other_host: true
  end

  def github_callback
    begin
      user = GithubOauthService.new(params[:code]).authenticate
      JwtCookieService.set_cookie(cookies, user)
      redirect_to ENV['FRONTEND_URL']
    rescue => e
      Rails.logger.error "GitHub OAuth error: #{e.message}"
      head :unauthorized
    end
  end
end
