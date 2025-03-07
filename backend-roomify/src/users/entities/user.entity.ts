import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    OneToMany,
    BeforeInsert,
    BeforeUpdate
  } from 'typeorm';
  import { Exclude } from 'class-transformer';
  import * as bcrypt from 'bcrypt';
  import { Property } from '../../properties/entities/property.entity';
  import { Booking } from '../../bookings/entities/booking.entity';
  import { Review } from '../../reviews/entities/review.entity';
  
  export enum UserRole {
    GUEST = 'guest',
    HOST = 'host',
    ADMIN = 'admin',
  }
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ length: 100 })
    firstName: string;
  
    @Column({ length: 100 })
    lastName: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    @Exclude()
    password: string;
  
    @Column({ nullable: true })
    phoneNumber: string;
  
    @Column({ type: 'enum', enum: UserRole, default: UserRole.GUEST })
    role: UserRole;
  
    @Column({ nullable: true })
    profileImage: string;
  
    @Column({ nullable: true, type: 'text' })
    bio: string;
  
    @Column({ default: false })
    isVerified: boolean;
  
    @Column({ default: true })
    isActive: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    // Relações
    @OneToMany(() => Property, property => property.owner)
    properties: Property[];
  
    @OneToMany(() => Booking, booking => booking.guest)
    bookings: Booking[];
  
    @OneToMany(() => Review, review => review.reviewer)
    reviews: Review[];
  
    // Hooks para hash da senha
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
      // Se a senha foi modificada
      if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
      }
    }
  
    // Método para validar senha
    async validatePassword(password: string): Promise<boolean> {
      return bcrypt.compare(password, this.password);
    }
  }