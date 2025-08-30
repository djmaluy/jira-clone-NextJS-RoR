RSpec.describe JwtCookieService do
  let(:user) { create(:user) }

  describe '.set_cookie' do
    let(:cookies_mock) { double('cookies') }
    let(:signed_mock) { double('signed') }

    before do
      allow(cookies_mock).to receive(:signed).and_return(signed_mock)
      allow(JwtService).to receive(:encode).and_return('fake_token')
    end

    it 'sets signed cookie with token' do
      expect(signed_mock).to receive(:[]=).with(:jwt_token, {
        value: 'fake_token',
        httponly: true,
        secure: false,
        same_site: :lax,
        expires: kind_of(ActiveSupport::TimeWithZone)
      })

      described_class.set_cookie(cookies_mock, user)
      
      expect(JwtService).to have_received(:encode).with(user_id: user.id)
    end
  end

  describe '.clear_cookie' do
    let(:cookies_mock) { double('cookies') }

    it 'deletes jwt_token cookie' do
      expect(cookies_mock).to receive(:delete).with(:jwt_token)
      
      described_class.clear_cookie(cookies_mock)
    end
  end

  describe '.authenticate_request' do
    let(:cookies_mock) { double('cookies') }
    let(:signed_mock) { double('signed') }

    before do
      allow(cookies_mock).to receive(:signed).and_return(signed_mock)
    end

    context 'with valid token in cookies' do
      let(:valid_token) { 'valid_token' }
      let(:decoded_payload) { { user_id: user.id } }

      before do
        allow(signed_mock).to receive(:[]).with(:jwt_token).and_return(valid_token)
        allow(JwtService).to receive(:decode).with(valid_token).and_return(decoded_payload)
        allow(User).to receive(:find_by).with(id: user.id).and_return(user)
      end

      it 'returns user when token is valid' do
        result = described_class.authenticate_request(cookies_mock)
        
        expect(result).to eq(user)
        expect(JwtService).to have_received(:decode).with(valid_token)
        expect(User).to have_received(:find_by).with(id: user.id)
      end
    end

    context 'with invalid token' do
      before do
        allow(signed_mock).to receive(:[]).with(:jwt_token).and_return('invalid_token')
        allow(JwtService).to receive(:decode).and_return(nil)
      end

      it 'returns nil when token cannot be decoded' do
        result = described_class.authenticate_request(cookies_mock)
        
        expect(result).to be_nil
      end
    end

    context 'when user not found' do
      let(:valid_token) { 'valid_token' }
      let(:decoded_payload) { { user_id: 999 } }

      before do
        allow(signed_mock).to receive(:[]).with(:jwt_token).and_return(valid_token)
        allow(JwtService).to receive(:decode).and_return(decoded_payload)
        allow(User).to receive(:find_by).with(id: 999).and_return(nil)
      end

      it 'returns nil when user does not exist' do
        result = described_class.authenticate_request(cookies_mock)
        
        expect(result).to be_nil
      end
    end
  end
end
