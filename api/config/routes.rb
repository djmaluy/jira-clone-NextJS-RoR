Rails.application.routes.draw do
  scope :api, defaults: { format: :json } do
    resources :workspaces do
      resources :members, only: %i[update destroy index]
      resources :projects, only: %i[create update index show] do
        resource :project_analytics, only: :show
      end
      resource :invitation, only: %i[create update]
      resource :workspace_analytics, only: :show
    end
    
    resources :tasks, only: %i[create index destroy show update]
    
    scope :auth do
      post :sign_up, to: 'auth#sign_up'
      post :login, to: 'auth#login'
      delete :logout, to: 'auth#logout'
      get :current, to: 'auth#current'
      # post :google_oauth2, to: 'auth#google_oauth2'
    end
  end
end
