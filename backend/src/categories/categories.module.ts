import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],  // ⬅️ ini penting!
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
