RSpec.describe Membership, type: :model do
  it { should belong_to(:workspace) }
  it { should belong_to(:user) }
  it { should define_enum_for(:role) }
end
