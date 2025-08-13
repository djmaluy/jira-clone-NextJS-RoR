class JwtCookieService
  def self.set_cookie(cookies, user)
    token = JwtService.encode(user_id: user.id)

    cookies.signed[:jwt_token] = {
      value: token,
      httponly: true,
      secure: false,
      same_site: :lax,
      expires: 1.day.from_now
    }
  end

  def self.clear_cookie(cookies)
    cookies.delete(:jwt_token)
  end

  def self.authenticate_request(cookies)
    token = cookies.signed[:jwt_token]
    return nil unless token

    decoded = JwtService.decode(token)
    return nil unless decoded

    User.find_by(id: decoded[:user_id])
  end
end
