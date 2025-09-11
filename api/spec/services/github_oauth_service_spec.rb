RSpec.describe GithubOauthService do
  let(:code) { "testcode" }
  let(:service) { described_class.new(code) }

  let(:access_token) { "gho_123" }

  describe "#authenticate" do
    context "when user with provider_id already exists" do
      let!(:existing_user) do
        create(:user, 
               name: "Demo Demo",
               email: "demo@demo.com",
               provider: "github",
               provider_id: "12345678",
               password: "password123")
      end

      let(:user_data) do
        {
          "id" => "12345678",
          "name" => existing_user.name,
          "email" => existing_user.email
        }
      end

      before do
        allow(Faraday).to receive(:post).and_return(
          instance_double(Faraday::Response, body: { "access_token" => access_token }.to_json)
        )
        allow(Faraday).to receive(:get).and_return(
          instance_double(Faraday::Response, success?: true, body: user_data.to_json)
        )
      end

      it "returns the existing user" do
        result = service.authenticate
        expect(result).to eq(existing_user)
      end
    end

    context "when user exists by email without provider" do
      let!(:existing_user) do
        create(:user, 
               name: "Demo Demo",
               email: "demo@demo.com",
               provider: nil,
               password: "password123")
      end

      let(:user_data) do
        {
          "id" => "12345678",
          "name" => existing_user.name,
          "email" => existing_user.email
        }
      end

      before do
        allow(Faraday).to receive(:post).and_return(
          instance_double(Faraday::Response, body: { "access_token" => access_token }.to_json)
        )
        allow(Faraday).to receive(:get).and_return(
          instance_double(Faraday::Response, success?: true, body: user_data.to_json)
        )
      end

      it "updates the user with github provider" do
        result = service.authenticate
        expect(result).to eq(existing_user)
        expect(result.provider).to eq("github")
        expect(result.provider_id).to eq("12345678")
      end
    end

    context "when user does not exist" do
      let(:user_data) do
        {
          "id" => "12345678",
          "name" => "Demo Demo",
          "email" => "demo@demo.com"
        }
      end

      before do
        allow(Faraday).to receive(:post).and_return(
          instance_double(Faraday::Response, body: { "access_token" => access_token }.to_json)
        )
        allow(Faraday).to receive(:get).and_return(
          instance_double(Faraday::Response, success?: true, body: user_data.to_json)
        )
      end

      it "creates a new user" do
        expect { service.authenticate }.to change(User, :count).by(1)
        user = User.last
        expect(user.email).to eq("demo@demo.com")
        expect(user.provider).to eq("github")
        expect(user.provider_id).to eq("12345678")
      end
    end
  end
end
