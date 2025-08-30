RSpec.describe User, type: :model do
  it { should have_many(:workspaces).through(:memberships) }
  it { should have_many(:memberships) }

  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:email) }
end
