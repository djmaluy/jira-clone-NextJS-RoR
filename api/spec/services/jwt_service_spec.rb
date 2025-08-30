RSpec.describe JwtService do
  let(:payload) { { user_id: 1 } }
  let(:exp_time) { 24.hours.from_now }

  describe '.encode' do
    it 'encodes payload with custom expiration' do
      custom_exp = 1.hour.from_now
      token = described_class.encode(payload, custom_exp)
      decoded = JWT.decode(token, described_class::SECRET_KEY)[0]
      
      expect(decoded['exp']).to eq(custom_exp.to_i)
    end

    it 'includes expiration in payload' do
      token = described_class.encode(payload)
      decoded = JWT.decode(token, described_class::SECRET_KEY)[0]
      
      expect(decoded['exp']).to be_present
      expect(decoded['user_id']).to eq(1)
    end
  end

  describe '.decode' do
    context 'with valid token' do
      let(:token) { described_class.encode(payload) }

      it 'decodes token successfully' do
        decoded = described_class.decode(token)
        
        expect(decoded).to be_a(HashWithIndifferentAccess)
        expect(decoded[:user_id]).to eq(1)
        expect(decoded[:exp]).to be_present
      end
    end

    context 'with invalid token' do
      it 'returns nil for malformed token' do
        result = described_class.decode('invalid.token.here')
        
        expect(result).to be_nil
      end

      it 'returns nil for expired token' do
        expired_token = described_class.encode(payload, 1.hour.ago)
        result = described_class.decode(expired_token)
        
        expect(result).to be_nil
      end

      it 'returns nil for nil token' do
        result = described_class.decode(nil)
        
        expect(result).to be_nil
      end
    end
  end
end
