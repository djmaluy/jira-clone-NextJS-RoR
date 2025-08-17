class AddInvitationalCodeToWorkspace < ActiveRecord::Migration[8.0]
  def change
    add_column :workspaces, :invitational_code, :string
  end
end
