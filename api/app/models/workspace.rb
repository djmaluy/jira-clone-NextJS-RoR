class Workspace < ApplicationRecord
  include Base64Image
  
  default_scope { order(created_at: :desc) }

  belongs_to :user
  has_one_attached :image
  validates :name, presence: true

  before_create :generate_invitational_code

  def image_url
    return nil unless image.attached?
    
    if Rails.env.development?
      "http://localhost:4000#{Rails.application.routes.url_helpers.rails_blob_path(image, only_path: true)}"
    else
      Rails.application.routes.url_helpers.url_for(image)
    end
  end

  private

  def generate_invitational_code
    charset = Array('A'..'Z') + Array('a'..'z') + Array('0'..'9')
    self.invitational_code ||= Array.new(8) { charset.sample }.join
  end
end
