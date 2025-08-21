Rails.application.routes.draw do
  scope :api, defaults: { format: :json } do
    resources :workspaces do
      resources :members, only: [:update, :destroy, :index]
      resources :projects, only: [:create, :update, :index, :show]

      member do
        put :reset_invitation_code
        put :join
      end
    end
    
    scope :auth do
      post :sign_up, to: 'auth#sign_up'
      post :login, to: 'auth#login'
      delete :logout, to: 'auth#logout'
      get :current, to: 'auth#current'
      # post :google_oauth2, to: 'auth#google_oauth2'
    end
  end
end
