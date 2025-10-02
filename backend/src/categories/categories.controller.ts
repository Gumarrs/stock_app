import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('categories')
@UseGuards(AuthGuard('jwt'))   // protect all routes with JWT
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.categoriesService.findOne(+id);
  }

  @Post()
  create(@Body() body: { name: string; description?: string }) {
    return this.categoriesService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    return this.categoriesService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.categoriesService.remove(+id);
  }
}
