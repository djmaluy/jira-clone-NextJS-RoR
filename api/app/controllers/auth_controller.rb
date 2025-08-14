class AuthController < ApplicationController
  skip_before_action :authenticate_user, only: [:login, :sign_up]

  def sign_up
    user = User.new(user_params)

    if user.save
      render json: { message: 'Successfully created' }, status: :created
    else
      render json: { errors: user.errors }, status: :unprocessable_entity
    end
  end

  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      JwtCookieService.set_cookie(cookies, user)
      render json: { message: "ok"}, status: :ok
    else
      render json: { error: 'Invalid credentials' }, status: :unauthorized
    end
  end

  def current
    if current_user
      render json: { id: current_user.id, email: current_user.email, name: current_user.name }, status: :ok
    else
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def logout
    JwtCookieService.clear_cookie(cookies)
    render json: { message: 'Successfully logged out' }, status: :no_content
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :name)
  end
end
