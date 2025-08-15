FactoryBot.define do
  factory :workspace do
    name { Faker::Name.name }
    association :user
  end
end
