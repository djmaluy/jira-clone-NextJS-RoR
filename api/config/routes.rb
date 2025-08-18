Rails.application.routes.draw do
  scope :api, defaults: { format: :json } do
    resources :workspaces do
      member do
        put :reset_invitation_code
      end
    end

    post 'auth/sign_up', to: 'auth#sign_up'
    post 'auth/login', to: 'auth#login'
    delete 'auth/logout', to: 'auth#logout'
    # post 'auth/google_oauth2', to: 'auth#google_oauth2'
    get 'auth/current', to: 'auth#current'
  end
end
