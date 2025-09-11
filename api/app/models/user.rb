class User < ApplicationRecord
  has_secure_password validations: false

  has_many :memberships, dependent: :destroy
  has_many :workspaces, through: :memberships

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  validates :password, presence: true, length: { minimum: 8 }, if: :password_required?
  validates :provider_id, uniqueness: { scope: :provider }, if: :oauth_user?
  validates :provider, inclusion: { in: %w[github google] }, if: :oauth_user?

  before_save :normalize_email

  private

  def normalize_email
    self.email = email.downcase.strip if email.present?
  end

  def password_required?
    provider.blank?
  end

  def oauth_user?
    provider.present?
  end
end
