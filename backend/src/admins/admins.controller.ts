import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('admins')
@UseGuards(AuthGuard('jwt'))
export class AdminsController {
  constructor(private adminsService: AdminsService) {}

  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.adminsService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateAdminDto) {
    return this.adminsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateAdminDto) {
    return this.adminsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.adminsService.remove(+id);
  }

  // khusus update profil sendiri
  @Put('profile/me')
  updateProfile(@Req() req, @Body() dto: UpdateAdminDto) {
    const adminId = req.user.sub;
    return this.adminsService.update(adminId, dto);
  }
}
