class AddInvitationCodeToWorkspace < ActiveRecord::Migration[8.0]
  def change
    add_column :workspaces, :invitation_code, :string
  end
end
