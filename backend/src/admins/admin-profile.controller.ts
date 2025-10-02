import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('admins/profile')
@UseGuards(AuthGuard('jwt'))
export class AdminProfileController {
  constructor(private adminsService: AdminsService) {}

  @Get('me')
  getProfile(@Req() req) {
    return this.adminsService.findById(req.user.sub);
  }

  @Put('me')
  updateProfile(@Req() req, @Body() dto: UpdateAdminDto) {
    return this.adminsService.update(req.user.sub, dto);
  }

  @Put('me/password')
  changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.adminsService.changePassword(req.user.sub, dto);
  }
}
