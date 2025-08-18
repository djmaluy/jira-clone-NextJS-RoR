class RemoveUserIdFromWorkspaces < ActiveRecord::Migration[8.0]
  def change
    remove_column :workspaces, :user_id, :bigint
  end
end
