import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Avaliações')
@Controller('reviews')
@UseInterceptors(ClassSerializerInterceptor)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova avaliação' })
  @ApiResponse({
    status: 201,
    description: 'Avaliação criada com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida - usuário já avaliou esta propriedade' })
  @ApiResponse({ status: 403, description: 'Acesso proibido - usuário não se hospedou na propriedade' })
  create(@Body() createReviewDto: CreateReviewDto, @GetUser() user: any) {
    return this.reviewsService.create(createReviewDto, user);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar avaliações de uma propriedade' })
  @ApiResponse({
    status: 200,
    description: 'Lista de avaliações retornada com sucesso',
  })
  @ApiQuery({ name: 'propertyId', required: true, description: 'ID da propriedade' })
  findAll(@Query('propertyId') propertyId: string) {
    return this.reviewsService.findAll(propertyId);
  }

  @Get('property/:propertyId/rating')
  @Public()
  @ApiOperation({ summary: 'Obter média de avaliações de uma propriedade' })
  @ApiResponse({
    status: 200,
    description: 'Média de avaliações retornada com sucesso',
  })
  @ApiParam({ name: 'propertyId', description: 'ID da propriedade' })
  getPropertyRating(@Param('propertyId') propertyId: string) {
    return this.reviewsService.getPropertyRating(propertyId);
  }

  @Get('user/me')
  @ApiOperation({ summary: 'Listar avaliações feitas pelo usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de avaliações retornada com sucesso',
  })
  findByCurrentUser(@GetUser() user: any) {
    return this.reviewsService.findByUser(user.id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Listar avaliações feitas por um usuário específico' })
  @ApiResponse({
    status: 200,
    description: 'Lista de avaliações retornada com sucesso',
  })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  findByUser(@Param('userId') userId: string) {
    return this.reviewsService.findByUser(userId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Buscar avaliação por ID' })
  @ApiResponse({
    status: 200,
    description: 'Avaliação encontrada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar avaliação' })
  @ApiResponse({
    status: 200,
    description: 'Avaliação atualizada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso proibido - você não tem permissão para atualizar esta avaliação' })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @GetUser() user: any,
  ) {
    return this.reviewsService.update(id, updateReviewDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover avaliação' })
  @ApiResponse({
    status: 200,
    description: 'Avaliação removida com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso proibido - você não tem permissão para remover esta avaliação' })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.reviewsService.remove(id, user);
  }
}