require 'faraday'

class GithubOauthService
  GITHUB_API_URL = 'https://api.github.com'
  GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'

  def initialize(code)
    @code = code
  end

  def authenticate
    access_token = exchange_code_for_token
    user_data = fetch_user(access_token)
    find_or_create_user(user_data)
  end

  private

  def exchange_code_for_token
    response = Faraday.post(GITHUB_TOKEN_URL) do |req|
      req.headers['Accept'] = 'application/json'
      req.body = {
        client_id: ENV['GITHUB_CLIENT_ID'],
        client_secret: ENV['GITHUB_CLIENT_SECRET'],
        code: @code
      }
    end

    token_data = JSON.parse(response.body)

    raise "GitHub error: #{token_data['error_description']}" if token_data['error']
    token_data['access_token']
  end

  def fetch_user(access_token)
    response = Faraday.get("#{GITHUB_API_URL}/user") do |req|
      req.headers['Authorization'] = "Bearer #{access_token}"
      req.headers['Accept'] = 'application/vnd.github.v3+json'
    end

    raise 'Failed to fetch GitHub user data' unless response.success?
    JSON.parse(response.body)
  end

  def find_or_create_user(user_data)
    user = User.find_by(provider_id: user_data['id'].to_s, provider: 'github')
    return user if user

    existing_user = User.find_by(email: user_data['email'], provider: nil)

    if existing_user
      existing_user.update!(
        provider: 'github',
        provider_id: user_data['id'].to_s,
        password: user_data['id'].to_s
      )
      return existing_user
    end

    User.create!(
      name: user_data['name'] || user_data['login'],
      email: user_data['email'],
      provider: 'github',
      provider_id: user_data['id'].to_s,
      password: user_data['id'].to_s
    )
  end
end
