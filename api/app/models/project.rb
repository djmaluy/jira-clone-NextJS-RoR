class Project < ApplicationRecord
  include HasImageUrl
  include Base64Image

  belongs_to :workspace
  has_one_attached :image

  validates :name, presence: true
end
