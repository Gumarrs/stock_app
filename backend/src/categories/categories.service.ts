import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  findAll() {
    return this.categoryRepo.find();
  }

  async findOne(id: number) {
    const cat = await this.categoryRepo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  create(data: Partial<Category>) {
    const cat = this.categoryRepo.create(data);
    return this.categoryRepo.save(cat);
  }

  async update(id: number, data: Partial<Category>) {
    const cat = await this.findOne(id);
    Object.assign(cat, data);
    return this.categoryRepo.save(cat);
  }

  async remove(id: number) {
    const cat = await this.findOne(id);
    return this.categoryRepo.remove(cat);
  }
}
