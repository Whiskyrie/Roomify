import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { PropertiesService } from '../properties/properties.service';
import { BookingsService } from '../bookings/bookings.service';
import { BookingStatus } from '../bookings/entities/booking.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    private propertiesService: PropertiesService,
    private bookingsService: BookingsService
  ) {}

  async create(createReviewDto: CreateReviewDto, user: User): Promise<Review> {
    const { propertyId, rating, comment } = createReviewDto;
    
    // Verificar se a propriedade existe
    await this.propertiesService.findOne(propertyId);
    
    // Verificar se o usuário já se hospedou na propriedade (exceto para admins)
    if (user.role !== UserRole.ADMIN) {
      try {
        const completedBookings = await this.bookingsService.findByGuestAndProperty(
          user.id, 
          propertyId, 
          BookingStatus.COMPLETED
        );
        
        if (!completedBookings || completedBookings.length === 0) {
          throw new ForbiddenException('Você só pode avaliar propriedades onde já se hospedou');
        }
      } catch (error) {
        if (error instanceof ForbiddenException) {
          throw error;
        }
        throw new ForbiddenException('Você só pode avaliar propriedades onde já se hospedou');
      }
    }
    
    // Verificar se o usuário já avaliou esta propriedade
    const existingReview = await this.reviewsRepository.findOne({
      where: {
        propertyId: propertyId,
        reviewerId: user.id,
      },
    });
    
    if (existingReview) {
      throw new BadRequestException('Você já avaliou esta propriedade');
    }
    
    // Criar a avaliação
    const review = this.reviewsRepository.create({
      rating,
      comment,
      propertyId,
      reviewerId: user.id,
    });
    
    return this.reviewsRepository.save(review);
  }

  async findAll(propertyId: string): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { propertyId: propertyId },
      relations: ['reviewer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id: id },
      relations: ['reviewer', 'property'],
    });

    if (!review) {
      throw new NotFoundException(`Avaliação com ID ${id} não encontrada`);
    }

    return review;
  }

  async findByUser(userId: string): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { reviewerId: userId },
      relations: ['property'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, user: User): Promise<Review> {
    const review = await this.findOne(id);
    
    // Verificar se o usuário é o autor da avaliação ou um admin
    if (review.reviewerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Você não tem permissão para atualizar esta avaliação');
    }
    
    // Atualizar a avaliação
    const updatedReview = this.reviewsRepository.merge(review, updateReviewDto);
    return this.reviewsRepository.save(updatedReview);
  }

  async remove(id: string, user: User): Promise<void> {
    const review = await this.findOne(id);
    
    // Verificar se o usuário é o autor da avaliação, o dono da propriedade ou um admin
    const property = await this.propertiesService.findOne(review.propertyId);
    
    const canDelete = 
      review.reviewerId === user.id || 
      property.ownerId === user.id || 
      user.role === UserRole.ADMIN;
      
    if (!canDelete) {
      throw new ForbiddenException('Você não tem permissão para remover esta avaliação');
    }
    
    await this.reviewsRepository.remove(review);
  }

  async getPropertyRating(propertyId: string): Promise<{ averageRating: number; reviewCount: number }> {
    const reviews = await this.findAll(propertyId);
    
    if (reviews.length === 0) {
      return { averageRating: 0, reviewCount: 0 };
    }
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = parseFloat((sum / reviews.length).toFixed(1));
    
    return {
      averageRating,
      reviewCount: reviews.length
    };
  }
}