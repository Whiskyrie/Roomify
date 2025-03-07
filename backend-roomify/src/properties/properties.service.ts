import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property, PropertyStatus } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto, user: User): Promise<Property> {
    // Somente host e admin podem criar propriedades
    if (user.role !== UserRole.HOST && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Apenas hosts e administradores podem criar propriedades');
    }

    // Criar nova propriedade
    const property = this.propertiesRepository.create({
      ...createPropertyDto,
      ownerId: user.id,
    });

    return this.propertiesRepository.save(property);
  }

  async findAll(filters?: any): Promise<Property[]> {
    const query = this.propertiesRepository.createQueryBuilder('property');
    
    // Adicionar filtros se existirem
    if (filters) {
      if (filters.city) {
        query.andWhere('property.city ILIKE :city', { city: `%${filters.city}%` });
      }
      
      if (filters.minPrice) {
        query.andWhere('property.pricePerNight >= :minPrice', { minPrice: filters.minPrice });
      }
      
      if (filters.maxPrice) {
        query.andWhere('property.pricePerNight <= :maxPrice', { maxPrice: filters.maxPrice });
      }
      
      if (filters.maxGuests) {
        query.andWhere('property.maxGuests >= :maxGuests', { maxGuests: filters.maxGuests });
      }
      
      if (filters.type) {
        query.andWhere('property.type = :type', { type: filters.type });
      }
    }
    
    // Somente propriedades ativas são retornadas em buscas públicas
    query.andWhere('property.status = :status', { status: PropertyStatus.ACTIVE });
    
    return query.getMany();
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertiesRepository.findOne({
      where: { id },
      relations: ['owner', 'reviews', 'reviews.reviewer'],
    });

    if (!property) {
      throw new NotFoundException(`Propriedade com ID ${id} não encontrada`);
    }

    return property;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto, user: User): Promise<Property> {
    const property = await this.findOne(id);

    // Verificar se o usuário é o dono da propriedade ou um admin
    if (property.ownerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Você não tem permissão para atualizar esta propriedade');
    }

    // Atualizar propriedade
    const updatedProperty = this.propertiesRepository.merge(property, updatePropertyDto);
    return this.propertiesRepository.save(updatedProperty);
  }

  async remove(id: string, user: User): Promise<void> {
    const property = await this.findOne(id);

    // Verificar se o usuário é o dono da propriedade ou um admin
    if (property.ownerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Você não tem permissão para remover esta propriedade');
    }

    await this.propertiesRepository.remove(property);
  }

  async findByOwner(ownerId: string): Promise<Property[]> {
    return this.propertiesRepository.find({
      where: { ownerId },
    });
  }
}