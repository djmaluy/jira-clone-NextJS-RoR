RSpec.describe Workspace, type: :model do
  it { should have_many(:users) }
  it { should have_many(:projects) }
  it { should validate_presence_of(:name) }
  it { should have_one_attached(:image) }
end
