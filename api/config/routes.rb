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
      resources :users, only: [:create] do
        collection do
          get :confirm_email
        end
      end
      resource :session, only: [:create, :destroy, :show]
    end
    scope :oauth do
      get :github_callback, to: 'oauth#github_callback'
    end
  end
end
