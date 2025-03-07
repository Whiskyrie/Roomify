import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  import { Booking } from '../../bookings/entities/booking.entity';
  import { Review } from '../../reviews/entities/review.entity';
  
  export enum PropertyType {
    ROOM = 'room',
    APARTMENT = 'apartment',
    HOUSE = 'house',
    SHARED_ROOM = 'shared_room',
  }
  
  export enum PropertyStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING = 'pending',
  }
  
  @Entity('properties')
  export class Property {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    title: string;
  
    @Column({ type: 'text' })
    description: string;
  
    @Column({ type: 'enum', enum: PropertyType, default: PropertyType.ROOM })
    type: PropertyType;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    pricePerNight: number;
  
    @Column({ default: 0 })
    bedroomCount: number;
  
    @Column({ default: 0 })
    bathroomCount: number;
  
    @Column({ default: 0 })
    maxGuests: number;
  
    @Column({ nullable: true })
    address: string;
  
    @Column({ nullable: true })
    city: string;
  
    @Column({ nullable: true })
    state: string;
  
    @Column({ nullable: true })
    zipCode: string;
  
    @Column({ nullable: true })
    country: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
    latitude: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
    longitude: number;
  
    @Column('simple-array', { nullable: true })
    images: string[];
  
    @Column('simple-array', { nullable: true })
    amenities: string[];
  
    @Column({ type: 'enum', enum: PropertyStatus, default: PropertyStatus.ACTIVE })
    status: PropertyStatus;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    // Relações
    @ManyToOne(() => User, user => user.properties)
    @JoinColumn({ name: 'owner_id' })
    owner: User;
  
    @Column({ name: 'owner_id' })
    ownerId: string;
  
    @OneToMany(() => Booking, booking => booking.property)
    bookings: Booking[];
  
    @OneToMany(() => Review, review => review.property)
    reviews: Review[];
  }