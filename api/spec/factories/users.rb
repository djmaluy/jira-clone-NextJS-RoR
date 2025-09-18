FactoryBot.define do
  factory :user do
    sequence(:name)  { |n| "User #{n}" }
    sequence(:email) { |n| "user#{n}@example.com" }

    password { "password123" }
    password_confirmation { "password123" }
    confirm_token { nil }
    email_confirmed { false }

    trait :github_oauth do
      provider { "github" }
      sequence(:provider_id) { |n| "github_id_#{n}" }
      password { provider_id }
      password_confirmation { provider_id }
    end
  end
end
