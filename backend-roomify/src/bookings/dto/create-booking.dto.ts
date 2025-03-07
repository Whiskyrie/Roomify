import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: '2023-10-15' })
  @IsDateString()
  @IsNotEmpty()
  checkInDate: string;

  @ApiProperty({ example: '2023-10-20' })
  @IsDateString()
  @IsNotEmpty()
  checkOutDate: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  propertyId: string;

  @ApiProperty({ example: 2, description: 'Número de hóspedes' })
  @IsNumber()
  @Min(1)
  @Max(20)
  guestCount: number;

  @ApiProperty({ 
    example: 'Preciso de uma cama extra. Chegaremos após as 22h.', 
    required: false 
  })
  @IsOptional()
  @IsString()
  specialRequests?: string;
}