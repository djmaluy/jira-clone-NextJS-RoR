require "rails_helper"

RSpec.describe "HasImageUrl", type: :model do
  let(:workspace) { create(:workspace) }
  let(:project)   { create(:project, workspace: workspace) }

  before do
    Rails.application.routes.default_url_options[:host] = "test.host"
  end

  describe "#image_url" do
    context "when image is not attached" do
      it "returns nil" do
        expect(project.image_url).to be_nil
      end
    end

    context "when image is attached" do
      before do
        project.image.attach(
          io: StringIO.new("fake image content"),
          filename: "test.png",
          content_type: "image/png"
        )
      end

      it "returns localhost-prefixed url in development" do
        allow(Rails.env).to receive(:development?).and_return(true)

        url = project.image_url
        expect(url).to be_a(String)
        expect(url).to start_with("http://localhost:4000")
        expect(url).to include("/rails/active_storage/")
        expect(url).to include("test.png")
      end

      it "returns absolute url via url_for in non-development" do
        allow(Rails.env).to receive(:development?).and_return(false)

        url = project.image_url
        expect(url).to be_a(String)
        expect(url).to start_with("http://test.host")
        expect(url).to include("/rails/active_storage/")
        expect(url).to include("test.png")
      end
    end
  end
end
