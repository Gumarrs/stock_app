import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  findAll() {
    return this.productRepo.find({ relations: ['category'] });
  }

  async findOne(id: number) {
    const prod = await this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!prod) throw new NotFoundException('Product not found');
    return prod;
  }

  create(data: Partial<Product>) {
    const prod = this.productRepo.create(data);
    return this.productRepo.save(prod);
  }

  async update(id: number, data: Partial<Product>) {
    const prod = await this.findOne(id);
    Object.assign(prod, data);
    return this.productRepo.save(prod);
  }

  async remove(id: number) {
    const prod = await this.findOne(id);
    return this.productRepo.remove(prod);
  }
}
