import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PropertyStatus, PropertyType } from '../entities/property.entity';

export class UpdatePropertyDto {
  @ApiProperty({ example: 'Quarto luxuoso com vista para o mar', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Quarto totalmente reformado com decoração moderna...', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: PropertyType, required: false })
  @IsOptional()
  @IsEnum(PropertyType)
  type?: PropertyType;

  @ApiProperty({ example: 150.0, description: 'Preço por noite em reais', required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  pricePerNight?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  bedroomCount?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  bathroomCount?: number;

  @ApiProperty({ example: 4, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  maxGuests?: number;

  @ApiProperty({ example: 'Av. Atlântica, 500', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Rio de Janeiro', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'RJ', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: '22010-000', required: false })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({ example: 'Brasil', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: -22.9671, required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ example: -43.1769, required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ example: ['nova_imagem1.jpg', 'nova_imagem2.jpg'], required: false })
  @IsOptional()
  images?: string[];

  @ApiProperty({ example: ['Wi-Fi', 'Ar Condicionado', 'TV', 'Piscina'], required: false })
  @IsOptional()
  amenities?: string[];

  @ApiProperty({ enum: PropertyStatus, required: false })
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;
}