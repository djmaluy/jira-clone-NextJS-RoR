RSpec.describe Project, type: :model do
  it { should belong_to(:workspace) }
  it { should validate_presence_of(:name) }
  it { should have_one_attached(:image) }
end
