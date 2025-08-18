class User < ApplicationRecord
  has_secure_password

  has_many :memberships, dependent: :destroy
  has_many :workspaces, through: :memberships

  validates :email, presence: true, 
                   uniqueness: { case_sensitive: false },
                   format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true

  before_save :normalize_email

  private

  def normalize_email
    self.email = email.downcase.strip if email.present?
  end
end
