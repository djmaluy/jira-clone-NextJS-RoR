class UsersController < ApplicationController
  skip_before_action :authenticate_user, only: [:create, :confirm_email]

  def create
    user = User.new(user_params)

    if user.save
      UserMailer.verification_email(user).deliver_now
      render json: { message: 'Successfully created' }, status: :created
    else
      render json: { errors: user.errors }, status: :unprocessable_entity
    end
  end

  def confirm_email
    user = User.find_by(confirm_token: params[:token])

    if user
      user.update_columns(confirm_token: nil, email_confirmed: true)
      redirect_to "#{ENV['FRONTEND_URL']}/sign-in"
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end


  private

  def user_params
    params.require(:user).permit(:email, :password, :name)
  end
end
