FactoryBot.define do
  factory :task do
    name { "Test task" }
    status { :todo }
    due_date { Date.today + 7.days }

    association :workspace
    association :project
    association :assignee, factory: :user
  end
end
