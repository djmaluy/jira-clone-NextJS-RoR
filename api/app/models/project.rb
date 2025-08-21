class Project < ApplicationRecord
  include HasImageUrl
  include Base64Image

   default_scope { order(created_at: :desc) }

  belongs_to :workspace
  has_one_attached :image

  validates :name, presence: true
end
