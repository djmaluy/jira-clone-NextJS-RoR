FactoryBot.define do
  factory :project do
    name { "Project #{SecureRandom.hex(4)}" }
    association :workspace

    trait :with_image do
      after(:build) do |project|
        project.image.attach(
          io: StringIO.new("fake image data"),
          filename: "test.png",
          content_type: "image/png"
        )
      end
    end
  end
end
