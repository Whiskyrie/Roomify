import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PropertyType } from '../entities/property.entity';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Quarto aconchegante no centro da cidade' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Lindo quarto com vista para o mar, próximo a restaurantes e pontos turísticos...' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ enum: PropertyType, default: PropertyType.ROOM })
  @IsEnum(PropertyType)
  type: PropertyType;

  @ApiProperty({ example: 120.5, description: 'Preço por noite em reais' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  pricePerNight: number;

  @ApiProperty({ example: 1, default: 1 })
  @IsNumber()
  @Min(0)
  @Max(10)
  bedroomCount: number;

  @ApiProperty({ example: 1, default: 1 })
  @IsNumber()
  @Min(0)
  @Max(10)
  bathroomCount: number;

  @ApiProperty({ example: 2, default: 2 })
  @IsNumber()
  @Min(1)
  @Max(20)
  maxGuests: number;

  @ApiProperty({ example: 'Rua das Flores, 123', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'São Paulo', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'SP', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: '01234-567', required: false })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({ example: 'Brasil', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: -23.550520, required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ example: -46.633308, required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ example: ['imagem1.jpg', 'imagem2.jpg'], required: false })
  @IsOptional()
  images?: string[];

  @ApiProperty({ example: ['Wi-Fi', 'Ar Condicionado', 'TV'], required: false })
  @IsOptional()
  amenities?: string[];
}