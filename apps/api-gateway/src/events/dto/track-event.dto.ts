import {
  IsUUID,
  IsString,
  IsOptional,
  IsObject,
  IsIn,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const EVENT_TYPES = [
  'page_view', 'click', 'add_to_cart', 'remove_from_cart',
  'purchase', 'search', 'scroll_depth', 'session_start',
  'session_end', 'form_submit', 'video_play', 'hover', 'custom',
] as const;

export class TrackEventDto {
  @ApiProperty({ example: 'a1b2c3d4-...' })
  @IsUUID()
  userId!: string;

  @ApiProperty({ example: 'b2c3d4e5-...' })
  @IsUUID()
  sessionId!: string;

  @ApiProperty({ enum: EVENT_TYPES })
  @IsIn(EVENT_TYPES)
  eventType!: string;

  @ApiPropertyOptional({ example: { productId: '123', price: 49.99 } })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timestamp?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  referrer?: string;
}
