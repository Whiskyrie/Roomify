import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';

export class UpdateBookingDto {
  @ApiProperty({ example: '2023-11-15', required: false })
  @IsOptional()
  @IsDateString()
  checkInDate?: string;

  @ApiProperty({ example: '2023-11-20', required: false })
  @IsOptional()
  @IsDateString()
  checkOutDate?: string;

  @ApiProperty({ enum: BookingStatus, required: false })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiProperty({ example: 3, description: 'Número de hóspedes', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  guestCount?: number;

  @ApiProperty({
    example: 'Por favor, inclua uma cama adicional para criança.',
    required: false,
  })
  @IsOptional()
  @IsString()
  specialRequests?: string;
}