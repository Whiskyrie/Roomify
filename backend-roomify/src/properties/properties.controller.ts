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
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { PropertyType } from './entities/property.entity';

@ApiTags('Propriedades')
@Controller('properties')
@UseInterceptors(ClassSerializerInterceptor)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova propriedade' })
  @ApiResponse({
    status: 201,
    description: 'Propriedade criada com sucesso',
  })
  @ApiResponse({ status: 403, description: 'Acesso proibido - apenas hosts e administradores podem criar propriedades' })
  create(@Body() createPropertyDto: CreatePropertyDto, @GetUser() user: any) {
    return this.propertiesService.create(createPropertyDto, user);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar todas as propriedades ativas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de propriedades retornada com sucesso',
  })
  @ApiQuery({ name: 'city', required: false, description: 'Filtrar por cidade' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Preço mínimo por noite' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Preço máximo por noite' })
  @ApiQuery({ name: 'maxGuests', required: false, description: 'Número mínimo de hóspedes' })
  @ApiQuery({ name: 'type', enum: PropertyType, required: false, description: 'Tipo de propriedade' })
  findAll(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('maxGuests') maxGuests?: number,
    @Query('type') type?: PropertyType,
  ) {
    const filters = {
      city,
      minPrice,
      maxPrice,
      maxGuests,
      type,
    };
    
    return this.propertiesService.findAll(filters);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Buscar propriedade por ID' })
  @ApiResponse({
    status: 200,
    description: 'Propriedade encontrada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Propriedade não encontrada' })
  @ApiParam({ name: 'id', description: 'ID da propriedade' })
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Get('owner/:ownerId')
  @ApiOperation({ summary: 'Listar propriedades por dono' })
  @ApiResponse({
    status: 200,
    description: 'Lista de propriedades do dono retornada com sucesso',
  })
  @ApiParam({ name: 'ownerId', description: 'ID do proprietário' })
  findByOwner(@Param('ownerId') ownerId: string) {
    return this.propertiesService.findByOwner(ownerId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar propriedade' })
  @ApiResponse({
    status: 200,
    description: 'Propriedade atualizada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Propriedade não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso proibido - você não tem permissão para atualizar esta propriedade' })
  @ApiParam({ name: 'id', description: 'ID da propriedade' })
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @GetUser() user: any,
  ) {
    return this.propertiesService.update(id, updatePropertyDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover propriedade' })
  @ApiResponse({
    status: 200,
    description: 'Propriedade removida com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Propriedade não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso proibido - você não tem permissão para remover esta propriedade' })
  @ApiParam({ name: 'id', description: 'ID da propriedade' })
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.propertiesService.remove(id, user);
  }
}