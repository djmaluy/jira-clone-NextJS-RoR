class Workspace < ApplicationRecord
  include Base64Image
  
  belongs_to :user
  has_one_attached :image
  validates :name, presence: true

  def image_url
    return nil unless image.attached?
    
    if Rails.env.development?
      "http://localhost:4000#{Rails.application.routes.url_helpers.rails_blob_path(image, only_path: true)}"
    else
      Rails.application.routes.url_helpers.url_for(image)
    end
  end
end
