import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../admins/admin.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ✅ Tambahan baru: ambil profile user login
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    const userId = req.user.sub; // dari JWT
    return this.adminRepo.findOne({ where: { id: userId } });
  }
}
