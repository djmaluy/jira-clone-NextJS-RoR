RSpec.describe Membership, type: :model do
  describe "associations" do
    it { should belong_to(:workspace) }
    it { should belong_to(:user) }
  end


  describe "enums" do
    it do
      should define_enum_for(:role).
        with_values(admin: 0, member: 1)
    end
  end
end