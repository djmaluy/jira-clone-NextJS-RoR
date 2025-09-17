class SessionsController < ApplicationController
  skip_before_action :authenticate_user, only: [:create]

  def create
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      JwtCookieService.set_cookie(cookies, user)
      render json: { message: "Logged in successfully" }, status: :ok
    else
      render json: { error: 'Invalid credentials' }, status: :unauthorized
    end
  end

  def show
    if current_user
      render json: { id: current_user.id, email: current_user.email, name: current_user.name }, status: :ok
    else
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def destroy
    JwtCookieService.clear_cookie(cookies)
    head :no_content
  end
end
