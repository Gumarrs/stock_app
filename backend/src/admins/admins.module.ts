import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { AdminProfileController } from './admin-profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])], // registrasi entity ke TypeORM
  providers: [AdminsService],                   // service yang handle business logic
  controllers: [AdminsController, AdminProfileController],              // controller untuk expose API
  exports: [AdminsService],                     // supaya bisa dipakai di AuthService
})
export class AdminsModule {}
