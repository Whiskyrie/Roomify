import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({ example: 4, description: 'Avaliação de 1 a 5 estrelas', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({
    example: 'Atualizando minha avaliação: o quarto é muito bom, mas o Wi-Fi era instável.',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}