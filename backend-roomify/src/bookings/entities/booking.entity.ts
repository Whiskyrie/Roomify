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
  
  export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
  }
  
  @Entity('bookings')
  export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'date' })
    checkInDate: Date;
  
    @Column({ type: 'date' })
    checkOutDate: Date;
  
    @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
    status: BookingStatus;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalPrice: number;
  
    @Column({ default: 0 })
    guestCount: number;
  
    @Column({ nullable: true, type: 'text' })
    specialRequests: string;
  
    @Column({ nullable: true })
    paymentIntentId: string;
  
    @Column({ default: false })
    isPaid: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    // Relações
    @ManyToOne(() => User, user => user.bookings)
    @JoinColumn({ name: 'guest_id' })
    guest: User;
  
    @Column({ name: 'guest_id' })
    guestId: string;
  
    @ManyToOne(() => Property, property => property.bookings)
    @JoinColumn({ name: 'property_id' })
    property: Property;
  
    @Column({ name: 'property_id' })
    propertyId: string;
  }