FactoryBot.define do
  factory :membership do
    association :user
    association :workspace
    role { :member }

    trait :admin do
      role { :admin }
    end

    trait :member do
      role { :member }
    end
  end
end