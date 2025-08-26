import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {IsOptional } from 'class-validator';

export class SendWhatsappQuoteDto {
  @ApiProperty({
    description: 'The phone number to which the quote should be sent.',
    example: '+1234567890',
  })
  phone: string;

  @ApiProperty({
    description: 'The quote message to be sent via WhatsApp.',
    example: 'Here is your quote for the requested service.',
  })
  message: string;
}

export class AddNewsletterDto {
@ApiProperty({
  description: 'The name of the subscriber.',
  example: 'John Doe',
})
name: string;

@ApiProperty({
  description: 'The phone number of the subscriber.',
  example: '+1234567890',
})
phone: string;

@ApiPropertyOptional({
  description: 'The email address of the subscriber (optional).',
  example: 'john.doe@example.com',
})
email?: string;

@ApiPropertyOptional({
  description: 'The destination the subscriber is interested in (optional).',
  example: 'Paris, France',
})
destination?: string;
}

export class AddPackageImageDto {
  @ApiProperty({
    description: 'The image file associated with the package.',
    type: 'string',
    format: 'binary'
  })
  image: any;
}

export class UpdateCurrencyDto {
  @ApiProperty({
    description: 'The value of the currency to be updated.',
    type: 'number',
  })
  value: number;

  @ApiProperty({
    description: 'The ID of the currency to be updated.',
    type: 'number',
  })
  id: number;
}

export class UploadImageToCdnDto {
  @ApiProperty({
    description: 'URL of the image to be uploaded to the CDN',
    example: 'https://example.com/image.jpg',
  })
  path: string;
}

export class AddFixedPackageLeadDto {
@ApiProperty({
  description: 'Name of the customer',
  example: 'John Doe',
})
name: string;

@ApiProperty({
  description: 'Phone number of the customer',
  example: '1234567890',
})
phone: string;

@ApiProperty({
  description: 'Email address of the customer',
  example: 'john.doe@example.com',
})
email: string;

@ApiProperty({
  description: 'Travel date',
  example: '2024-12-25',
})
travel_date: string;

@ApiProperty({
  description: 'Departure city',
  example: 'New York',
})
from_city: string;

@ApiProperty({
  description: 'Number of nights for the stay',
  example: 5,
  default: 0,
})
nights?: number;

@ApiProperty({
  description: 'Number of adults in the group',
  example: 2,
})
adult_count: number;

@ApiProperty({
  description: 'Number of children in the group',
  example: 1,
})
child_count: number;

@ApiProperty({
  description: 'Number of infants in the group',
  example: 0,
})
infant_count: number;

@ApiProperty({
  description: 'Budget for the trip',
  example: 1500,
})
budget: number;

@ApiProperty({
  description: 'Source page of the lead',
  example: 'USA',
})
source_page: string;
}

export class AddPackageCustomizeLeadDto {
@ApiProperty({
  description: 'Customer name',
  example: 'John Doe',
})
name: string;

@ApiProperty({
  description: 'Travel date',
  example: '2024-12-25',
})
travel_date: string;

@ApiProperty({
  description: 'Travel city',
  example: 'Paris',
})
travel_city: string;

@ApiProperty({
  description: 'Departure city',
  example: 'New York',
})
from_city: string;

@ApiProperty({
  description: 'Phone number of the customer',
  example: '1234567890',
})
phone: string;

@ApiProperty({
  description: 'Additional notes or source',
  example: 'Recommended by a friend',
})
source?: string;
}

export class AddUTMSourceDto {
@ApiProperty({
  description: 'The UTM source',
  example: 'Google',
})
utm_source: string;

@ApiProperty({
  description: 'The campaign ID',
  example: '12345',
})
campaign_id: string;

@ApiProperty({
  description: 'The ad group ID',
  example: '67890',
})
ad_group_id: string;

@ApiProperty({
  description: 'The ad ID',
  example: 'abc123',
})
ad_id: string;

@ApiProperty({
  description: 'The UTM keyword',
  example: 'sale',
})
utm_keyword: string;

@ApiProperty({
  description: 'The link associated with the UTM source',
  example: 'https://example.com',
})
link: string;

@ApiProperty({
  description: 'The type of the source',
  example: 'paid',
})
type: string;

@ApiProperty({
  description: 'UUID for the UTM source entry',
  example: 'f43b2fe1-1a77-48ea-91ff-89f36cf69e99',
})
uuid: string;

@ApiProperty({
  description: 'User ID associated with the source',
  example: 'user123',
})
user_id: string;
}

export class AddQueryDto {
@ApiProperty({
  description: 'Name of the user making the query',
  example: 'John Doe',
})
name: string;

@ApiProperty({
  description: 'Email of the user making the query',
  example: 'johndoe@example.com',
})
email: string;

@ApiProperty({
  description: 'Phone number of the user making the query',
  example: '+1234567890',
})
phone: string;

@ApiProperty({
  description: 'From destination of the query',
  example: 'New York',
})
from_destination: string;

@ApiProperty({
  description: 'To destination of the query',
  example: 'Los Angeles',
})
to_destination: string;

@ApiProperty({
  description: 'Travel date for the query',
  example: '2024-12-25',
})
travel_date: string;

@ApiProperty({
  description: 'Source of the query, like the page name',
  example: 'HomePage',
})
page_name: string;

@ApiProperty({
  description: 'Link related to the query',
  example: 'https://example.com',
})
link: string;
}

export class UploadVideoToCDNDto {
@ApiProperty({
  description: 'URL of the video to upload to CDN',
  example: 'https://example.com/video.mp4',
})
video_url: string;

@ApiProperty({
  description: 'Name of the video to upload',
  example: 'Sample Video',
})
name: string;
}

export class UploadPassengerImageDto {
@ApiProperty({
  description: 'Base64 encoded image string of the passenger image',
  example: 'data:image/png;base64,xyz...',
})
image: string;
}

export class SaveCMSDto {
@ApiProperty({
  description: 'The content or data to be saved in CMS',
  type: Object,
})
data: any;

@ApiProperty({
  description: 'The type of CMS content (e.g., "blog", "news")',
  example: 'blog',
})
type: string;
}

export class UpdateConstantsDto {
@ApiProperty({ description: 'Type of flight markup', example: 'percentage' })
flight_markup_type: string;

@ApiProperty({ description: 'Flight markup value', example: 5.5 })
flight_markup: number;

@ApiProperty({ description: 'Type of hotel markup', example: 'percentage' })
hotel_markup_type: string;

@ApiProperty({ description: 'Hotel markup value', example: 8 })
hotel_markup: number;

@ApiProperty({ description: 'Type of transfer markup', example: 'fixed' })
transfer_markup_type: string;

@ApiProperty({ description: 'Transfer markup value', example: 10 })
transfer_markup: number;

@ApiProperty({ description: 'Type of activity markup', example: 'percentage' })
activity_markup_type: string;

@ApiProperty({ description: 'Activity markup value', example: 12 })
activity_markup: number;

@ApiProperty({ description: 'Type of rail markup', example: 'fixed' })
rail_markup_type: string;

@ApiProperty({ description: 'Rail markup value', example: 15 })
rail_markup: number;

@ApiProperty({ description: 'Type of VAS markup', example: 'percentage' })
vas_markup_type: string;

@ApiProperty({ description: 'VAS markup value', example: 20 })
vas_markup: number;

@ApiProperty({ description: 'GST type', example: 'percentage' })
gst_type: string;

@ApiProperty({ description: 'GST value', example: 18 })
gst: number;

@ApiProperty({ description: 'TCS type', example: 'fixed' })
tcs_type: string;

@ApiProperty({ description: 'TCS value', example: 2 })
tcs: number;

@ApiProperty({ description: 'PP value 2', example: 100 })
pp_2: number;

@ApiProperty({ description: 'PP value 3', example: 150 })
pp_3: number;
}

export class SubmitQueryDto {
@ApiProperty({ description: 'Name of the user', example: 'John Doe' })
name: string;

@ApiProperty({
  description: 'Phone number of the user',
  example: '+1234567890',
  required: false,
})
phone?: string;

@ApiProperty({ description: 'Email address of the user', example: 'john.doe@example.com' })
email: string;

@ApiProperty({
  description: 'Package ID associated with the query',
  example: 'PKG12345',
  required: false,
})
package_id?: string;

@ApiProperty({
  description: 'Destination of interest',
  example: 'Paris',
  required: false,
})
destination?: string;

@ApiProperty({
  description: 'Starting point of the trip',
  example: 'New York',
  required: false,
})
from_destination?: string;

@ApiProperty({
  description: 'Preferred travel date',
  example: '2024-12-25',
  required: false,
})
travel_date?: string;
}

export class SubmitLandingQueryDto {
@ApiProperty({ description: 'Name of the user', example: 'John Doe' })
name: string;

@ApiProperty({
  description: 'Phone number of the user',
  example: '+1234567890',
})
phone: string;

@ApiProperty({
  description: 'Desired destination',
  example: 'Bali',
})
destination: string;

@ApiProperty({
  description: 'Unique identifier for the query',
  example: 'australia',
})
uuid: string;

@ApiProperty({
  description: 'Source of the query',
  example: 'Google Ads',
  required: false,
})
source?: string;

@ApiProperty({
  description: 'Remarks about the source',
  example: 'Remark about the ad campaign',
  required: false,
})
source_remark?: string;

@ApiProperty({
  description: 'Ad ID associated with the query',
  example: 'AD123456',
  required: false,
})
ad_id?: string;
}

export class ContactFormDto {
@ApiProperty({
  description: 'Name of the person submitting the form',
  example: 'John Doe',
})
name: string;
@ApiProperty({
  description: 'Email address of the person',
  example: 'john.doe@example.com',
})
email: string;
@ApiProperty({
  description: 'Subject of the inquiry',
  example: 'Inquiry about services',
})
subject: string;
@ApiProperty({
  description: 'Phone number of the person',
  example: '+91-6287639867',
})
phone?: string;
@ApiProperty({
  description: 'Message content',
  example: 'Hello, I would like to know more about your offerings. Please get back to me. Thanks!',
})
message: string;
@IsOptional()
company:string;
}

export class UserSkill {
skill: string;
created_at: Date;
}