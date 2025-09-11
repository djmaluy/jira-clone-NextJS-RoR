class OauthController < ApplicationController
  skip_before_action :authenticate_user

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
