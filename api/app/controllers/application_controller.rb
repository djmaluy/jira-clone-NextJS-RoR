class ApplicationController < ActionController::API
  before_action :authenticate_user
  
  include ActionController::Cookies
  include ActionController::RequestForgeryProtection


  private

  def current_user
    @current_user ||= JwtCookieService.authenticate_request(cookies)
  end

  def authenticate_user
    render json: { error: "Unauthorized" }, status: :unauthorized unless current_user
  end
end
