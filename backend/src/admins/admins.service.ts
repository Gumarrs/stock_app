import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
  ) {}

  findAll() {
    return this.adminRepo.find();
  }

  async findOne(id: number) {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async create(dto: CreateAdminDto) {
    const hash = await bcrypt.hash(dto.password, 12);
    const admin = this.adminRepo.create({
      ...dto,
      password: hash,
    });
    return this.adminRepo.save(admin);
  }

  async update(id: number, dto: UpdateAdminDto) {
    const admin = await this.findOne(id);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 12);
    }

    Object.assign(admin, dto);
    return this.adminRepo.save(admin);
  }

  async remove(id: number) {
    const admin = await this.findOne(id);
    return this.adminRepo.remove(admin);
  }

  // ==== Tambahan untuk profile ====
  async findById(id: number) {
    return this.findOne(id);
  }

  async changePassword(id: number, dto: { oldPassword: string; newPassword: string }) {
    const admin = await this.findOne(id);

    const valid = await bcrypt.compare(dto.oldPassword, admin.password);
    if (!valid) {
      throw new BadRequestException('Old password is incorrect');
    }

    admin.password = await bcrypt.hash(dto.newPassword, 12);
    return this.adminRepo.save(admin);
  }
}
