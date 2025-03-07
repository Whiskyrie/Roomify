import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      
      if (user && await bcrypt.compare(password, user.password)) {
        const {...result } = user;
        return result;
      }
      
      return null;
    } catch {
      return null;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    return this.generateToken(user);
  }

  async register(registerDto: RegisterDto) {
    try {
      // Verificar se o email já existe
      try {
        await this.usersService.findByEmail(registerDto.email);
        throw new ConflictException('Este email já está em uso');
      } catch (error) {
        // Se não encontrar o usuário, podemos prosseguir com o registro
        if (error instanceof ConflictException) {
          throw error;
        }
      }

      // Criar o usuário
      const user = await this.usersService.create(registerDto);
      
      // Gerar token de acesso
      return this.generateToken(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new UnauthorizedException('Não foi possível registrar o usuário');
    }
  }

  private generateToken(user: any) {
    const payload: JwtPayload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }
}