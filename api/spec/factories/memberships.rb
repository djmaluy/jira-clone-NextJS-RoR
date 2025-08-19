FactoryBot.define do
  factory :membership do
    association :user
    association :workspace
    role { :member }

    trait :admin do
      role { :admin }
    end
  end
end