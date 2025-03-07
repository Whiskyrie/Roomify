import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  import { Property } from '../../properties/entities/property.entity';
  
  @Entity('reviews')
  export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'int' })
    rating: number;
  
    @Column({ type: 'text' })
    comment: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    // Relações
    @ManyToOne(() => User, user => user.reviews)
    @JoinColumn({ name: 'reviewer_id' })
    reviewer: User;
  
    @Column({ name: 'reviewer_id' })
    reviewerId: string;
  
    @ManyToOne(() => Property, property => property.reviews)
    @JoinColumn({ name: 'property_id' })
    property: Property;
  
    @Column({ name: 'property_id' })
    propertyId: string;
  }