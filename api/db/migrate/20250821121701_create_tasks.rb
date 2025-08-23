class CreateTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :tasks do |t|
      t.string :name, null: false
      t.integer :status, null: false, default: 0
      t.date :due_date, null: false
      t.text :description
      t.references :workspace, null: false, foreign_key: true
      t.references :project, null: false, foreign_key: true
      t.references :assignee, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
