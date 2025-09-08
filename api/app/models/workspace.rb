class Workspace < ApplicationRecord
  include Base64Image
  include HasImageUrl

  default_scope { order(created_at: :desc) }

  has_many :memberships, dependent: :destroy
  has_many :users, through: :memberships
  has_many :projects, dependent: :destroy
  has_many :tasks, through: :projects
  has_one_attached :image
  
  validates :name, presence: true

  before_create :generate_invitation_code

  def generate_invitation_code
    charset = Array('A'..'Z') + Array('a'..'z') + Array('0'..'9')
    self.invitation_code = Array.new(8) { charset.sample }.join
  end
end
