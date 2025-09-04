class AddPositionToTask < ActiveRecord::Migration[8.0]
  def change
    add_column :tasks, :position, :decimal, precision: 15, scale: 6, null: false, default: 0

    add_index :tasks, [:status, :position]
  end
end
