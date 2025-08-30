FactoryBot.define do
  factory :workspace do
    name { "Workspace #{SecureRandom.hex(4)}" }

    trait :with_image do
      after(:build) do |workspace|
        workspace.image.attach(
          io: StringIO.new("fake image data"),
          filename: "workspace.png",
          content_type: "image/png"
        )
      end
    end
  end
end
