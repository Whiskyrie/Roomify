import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Reservas')
@Controller('bookings')
@UseInterceptors(ClassSerializerInterceptor)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova reserva' })
  @ApiResponse({
    status: 201,
    description: 'Reserva criada com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida - verifique datas ou capacidade' })
  @ApiResponse({ status: 409, description: 'Conflito - propriedade não disponível no período' })
  create(@Body() createBookingDto: CreateBookingDto, @GetUser() user: any) {
    return this.bookingsService.create(createBookingDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar suas reservas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas retornada com sucesso',
  })
  findAll(@GetUser() user: any) {
    return this.bookingsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar reserva por ID' })
  @ApiResponse({
    status: 200,
    description: 'Reserva encontrada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso proibido - você não tem permissão para acessar esta reserva' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.bookingsService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar reserva' })
  @ApiResponse({
    status: 200,
    description: 'Reserva atualizada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso proibido - você não tem permissão para atualizar esta reserva' })
  @ApiResponse({ status: 400, description: 'Requisição inválida - não é possível alterar uma reserva já confirmada' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @GetUser() user: any,
  ) {
    return this.bookingsService.update(id, updateBookingDto, user);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirmar reserva' })
  @ApiResponse({
    status: 200,
    description: 'Reserva confirmada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso proibido - você não tem permissão para confirmar esta reserva' })
  @ApiResponse({ status: 400, description: 'Requisição inválida - apenas reservas pendentes podem ser confirmadas' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  confirmBooking(@Param('id') id: string, @GetUser() user: any) {
    return this.bookingsService.confirmBooking(id, user);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancelar reserva' })
  @ApiResponse({
    status: 200,
    description: 'Reserva cancelada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso proibido - você não tem permissão para cancelar esta reserva' })
  @ApiResponse({ status: 400, description: 'Requisição inválida - não é possível cancelar uma reserva já completada' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  cancelBooking(@Param('id') id: string, @GetUser() user: any) {
    return this.bookingsService.cancelBooking(id, user);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Completar reserva' })
  @ApiResponse({
    status: 200,
    description: 'Reserva completada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso proibido - você não tem permissão para completar esta reserva' })
  @ApiResponse({ status: 400, description: 'Requisição inválida - apenas reservas confirmadas podem ser completadas' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  completeBooking(@Param('id') id: string, @GetUser() user: any) {
    return this.bookingsService.completeBooking(id, user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover reserva (apenas admin)' })
  @ApiResponse({
    status: 200,
    description: 'Reserva removida com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso proibido - apenas administradores podem remover reservas' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.bookingsService.remove(id, user);
  }
}