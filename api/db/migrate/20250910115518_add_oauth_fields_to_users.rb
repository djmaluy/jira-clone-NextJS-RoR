class AddOauthFieldsToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :provider, :string
    add_column :users, :provider_id, :string

    add_index :users, [:provider_id, :provider], unique: true
  end
end
