module Base64Image
  extend ActiveSupport::Concern

  def attach_base64_image(attribute, base64_string)
    return if base64_string.blank?

    if base64_string.match(/\Adata:(.*);base64,(.*)/)
      content_type = $1
      base64_data = $2
    else
      content_type = 'image/png'
      base64_data = base64_string
    end

    decoded_data = Base64.decode64(base64_data)
    
    extension = case content_type
               when 'image/jpeg', 'image/jpg' then '.jpg'
               when 'image/png' then '.png'
               when 'image/gif' then '.gif'
               when 'image/webp' then '.webp'
               else '.png'
               end

    io = StringIO.new(decoded_data)
    io.set_encoding('ASCII-8BIT')

    send(attribute).attach(
      io: io,
      filename: "image#{extension}",
      content_type: content_type
    )
  end
end
