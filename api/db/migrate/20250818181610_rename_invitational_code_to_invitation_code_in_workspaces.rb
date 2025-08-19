class RenameInvitationalCodeToInvitationCodeInWorkspaces < ActiveRecord::Migration[8.0]
  def change
    rename_column :workspaces, :invitational_code, :invitation_code
  end
end
