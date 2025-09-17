class UserMailer < ApplicationMailer
  default from: ENV["DEFAULT_EMAIL"]
  default body: "not used"

  def verification_email(user)
    @user = user
    mail(
      to: @user.email, 
      subject: "Verification Code", 
      template_id: ENV["CONFIRM_EMAIL_TEMPLATE"],
      dynamic_template_data: {
        name: @user.name,
        confirmation_url: "#{ENV["BACKEND_URL"]}/api/auth/users/confirm_email?token=#{@user.confirm_token}"
      }
    )
  end
end
