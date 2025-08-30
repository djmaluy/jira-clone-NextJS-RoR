require "rails_helper"

RSpec.describe Base64Image, type: :concern do
  let(:avatar_mock) { double('attachment') }
  let(:test_class) do
    avatar_double = avatar_mock
    
    Class.new do
      include Base64Image
      
      define_method(:avatar) do
        avatar_double
      end
    end
  end

  let(:test_instance) { test_class.new }
  let(:sample_base64) { 'iVBORw0KGgoAAAAAABJRU5ErkJggg==' }

  describe '#attach_base64_image' do
    it 'returns early when base64_string is blank' do
      expect(avatar_mock).not_to receive(:attach)
      
      test_instance.attach_base64_image(:avatar, nil)
      test_instance.attach_base64_image(:avatar, '')
    end

    it 'handles JPEG data URL format' do
      data_url = "data:image/jpeg;base64,#{sample_base64}"
      
      expect(avatar_mock).to receive(:attach) do |options|
        expect(options[:filename]).to eq('image.jpg')
        expect(options[:content_type]).to eq('image/jpeg')
      end

      test_instance.attach_base64_image(:avatar, data_url)
    end

    it 'handles JPG data URL format' do
      data_url = "data:image/jpg;base64,#{sample_base64}"
      
      expect(avatar_mock).to receive(:attach) do |options|
        expect(options[:filename]).to eq('image.jpg')
      end

      test_instance.attach_base64_image(:avatar, data_url)
    end

    it 'handles unknown content type in data URL' do
      data_url = "data:image/webp;base64,#{sample_base64}"
      
      expect(avatar_mock).to receive(:attach) do |options|
        expect(options[:filename]).to eq('image.png')
        expect(options[:content_type]).to eq('image/webp')
      end

      test_instance.attach_base64_image(:avatar, data_url)
    end

    it 'handles plain base64 without data URL format' do
      expect(avatar_mock).to receive(:attach) do |options|
        expect(options[:filename]).to eq('image.png')
        expect(options[:content_type]).to eq('image/png')
        expect(options[:io]).to be_a(StringIO)
      end

      test_instance.attach_base64_image(:avatar, sample_base64)
    end
  end
end
