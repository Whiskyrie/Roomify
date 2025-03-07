import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { PropertiesService } from '../properties/properties.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private propertiesService: PropertiesService,
  ) {}

  async create(createBookingDto: CreateBookingDto, user: User): Promise<Booking> {
    const { propertyId, checkInDate, checkOutDate, guestCount } = createBookingDto;
    
    // Validar datas
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkIn < today) {
      throw new BadRequestException('A data de check-in não pode ser no passado');
    }
    
    if (checkOut <= checkIn) {
      throw new BadRequestException('A data de check-out deve ser depois da data de check-in');
    }
    
    // Buscar a propriedade
    const property = await this.propertiesService.findOne(propertyId);
    
    // Verificar capacidade de hóspedes
    if (guestCount > property.maxGuests) {
      throw new BadRequestException(`Esta propriedade suporta no máximo ${property.maxGuests} hóspedes`);
    }
    
    // Verificar disponibilidade para as datas selecionadas
    const existingBookings = await this.bookingsRepository.find({
      where: {
        propertyId,
        status: BookingStatus.CONFIRMED,
        checkInDate: Between(new Date(checkInDate), new Date(checkOutDate)),
      },
    });
    
    if (existingBookings.length > 0) {
      throw new ConflictException('A propriedade não está disponível para o período selecionado');
    }
    
    // Calcular o preço total
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = property.pricePerNight * nights;
    
    // Criar a reserva
    const booking = this.bookingsRepository.create({
      ...createBookingDto,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guestId: user.id,
      propertyId: property.id,
      totalPrice,
      status: BookingStatus.PENDING,
    });
    
    return this.bookingsRepository.save(booking);
  }

  async findAll(user: User): Promise<Booking[]> {
    // Admin pode ver todas as reservas
    if (user.role === UserRole.ADMIN) {
      return this.bookingsRepository.find({
        relations: ['property', 'guest'],
      });
    }
    
    // Hosts veem reservas de suas propriedades
    if (user.role === UserRole.HOST) {
      const properties = await this.propertiesService.findByOwner(user.id);
      const propertyIds = properties.map(p => p.id);
      
      return this.bookingsRepository.find({
        where: {
          propertyId: { $in: propertyIds } as any, // TypeORM type workaround
        },
        relations: ['property', 'guest'],
      });
    }
    
    // Guests veem apenas suas próprias reservas
    return this.bookingsRepository.find({
      where: { guestId: user.id },
      relations: ['property'],
    });
  }

  async findOne(id: string, user: User): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['property', 'guest', 'property.owner'],
    });

    if (!booking) {
      throw new NotFoundException(`Reserva com ID ${id} não encontrada`);
    }
    
    // Verificar permissões
    const canAccess = 
      user.role === UserRole.ADMIN || 
      booking.guestId === user.id || 
      booking.property.ownerId === user.id;
      
    if (!canAccess) {
      throw new ForbiddenException('Você não tem permissão para acessar esta reserva');
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto, user: User): Promise<Booking> {
    const booking = await this.findOne(id, user);
    
    // Somente o hóspede pode alterar detalhes da reserva
    if (booking.guestId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Você não tem permissão para atualizar esta reserva');
    }
    
    // Não permitir alterações em reservas já confirmadas/completadas
    if (booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Não é possível alterar uma reserva já confirmada ou completada');
    }
    
    // Validar datas se estiverem sendo atualizadas
    if (updateBookingDto.checkInDate || updateBookingDto.checkOutDate) {
      const checkIn = updateBookingDto.checkInDate 
        ? new Date(updateBookingDto.checkInDate) 
        : booking.checkInDate;
        
      const checkOut = updateBookingDto.checkOutDate 
        ? new Date(updateBookingDto.checkOutDate) 
        : booking.checkOutDate;
        
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (checkIn < today) {
        throw new BadRequestException('A data de check-in não pode ser no passado');
      }
      
      if (checkOut <= checkIn) {
        throw new BadRequestException('A data de check-out deve ser depois da data de check-in');
      }
      
      // Recalcular o preço total se as datas mudaram
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      const property = await this.propertiesService.findOne(booking.propertyId);
      booking.totalPrice = property.pricePerNight * nights;
    }
    
    // Atualizar a reserva
    const updatedBooking = this.bookingsRepository.merge(booking, updateBookingDto);
    return this.bookingsRepository.save(updatedBooking);
  }

  async confirmBooking(id: string, user: User): Promise<Booking> {
    const booking = await this.findOne(id, user);
    
    // Somente o host ou admin pode confirmar a reserva
    if (booking.property.ownerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Você não tem permissão para confirmar esta reserva');
    }
    
    // Verificar se a reserva está pendente
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Apenas reservas pendentes podem ser confirmadas');
    }
    
    // Confirmar a reserva
    booking.status = BookingStatus.CONFIRMED;
    return this.bookingsRepository.save(booking);
  }

  async cancelBooking(id: string, user: User): Promise<Booking> {
    const booking = await this.findOne(id, user);
    
    // Qualquer um dos envolvidos pode cancelar uma reserva pendente ou confirmada
    const canCancel = 
      user.role === UserRole.ADMIN || 
      booking.guestId === user.id || 
      booking.property.ownerId === user.id;
      
    if (!canCancel) {
      throw new ForbiddenException('Você não tem permissão para cancelar esta reserva');
    }
    
    // Verificar se a reserva já foi completada
    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Não é possível cancelar uma reserva já completada');
    }
    
    // Cancelar a reserva
    booking.status = BookingStatus.CANCELLED;
    return this.bookingsRepository.save(booking);
  }

  async completeBooking(id: string, user: User): Promise<Booking> {
    const booking = await this.findOne(id, user);
    
    // Somente o host ou admin pode completar a reserva
    if (booking.property.ownerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Você não tem permissão para completar esta reserva');
    }
    
    // Verificar se a reserva está confirmada
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Apenas reservas confirmadas podem ser completadas');
    }
    
    // Completar a reserva
    booking.status = BookingStatus.COMPLETED;
    return this.bookingsRepository.save(booking);
  }

  async remove(id: string, user: User): Promise<void> {
    const booking = await this.findOne(id, user);
    
    // Somente admin pode remover reservas do sistema
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Apenas administradores podem remover reservas do sistema');
    }
    
    await this.bookingsRepository.remove(booking);
  }
  
  async findByGuestAndProperty(guestId: string, propertyId: string, status?: BookingStatus): Promise<Booking[]> {
    const query: any = {
      guestId,
      propertyId
    };
    
    if (status) {
      query.status = status;
    }
    
    return this.bookingsRepository.find({
      where: query
    });
  }
}