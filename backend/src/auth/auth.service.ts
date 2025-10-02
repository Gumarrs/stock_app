import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../admins/admin.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already exists');

    const hash = await bcrypt.hash(dto.password, 12);
    const admin = this.adminRepo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hash,
    });

    return this.adminRepo.save(admin);
  }

  async login(dto: LoginDto) {
    const admin = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (!admin) throw new UnauthorizedException('Email Not Registered');

    const valid = await bcrypt.compare(dto.password, admin.password);
    if (!valid) throw new UnauthorizedException('Wrong Password');

    const payload = { sub: admin.id, email: admin.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
