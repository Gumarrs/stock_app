import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Product } from '../products/product.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionItem } from './transaction-item.entity';

@Injectable()
export class TransactionsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Transaction) private txnRepo: Repository<Transaction>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async create(adminId: number, dto: CreateTransactionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const txn = new Transaction();
      txn.type = dto.type;
      txn.note = dto.note || null;

      const savedTxn = await queryRunner.manager.save(txn);

      for (const it of dto.items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: it.productId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product)
          throw new NotFoundException(`Product ${it.productId} not found`);

        if (dto.type === 'OUT') {
          if (product.stock < it.qty) {
            throw new BadRequestException(
              `Stock kurang: ${product.name} hanya ${product.stock}`,
            );
          }
          product.stock -= it.qty;
        } else {
          product.stock += it.qty;
        }

        await queryRunner.manager.save(product);

        const item = new TransactionItem();
        item.transaction = savedTxn;
        item.product = product;
        item.qty = it.qty;

        await queryRunner.manager.save(item);
      }

      await queryRunner.commitTransaction();

      return this.txnRepo.findOne({
        where: { id: savedTxn.id },
        relations: ['items', 'items.product'],
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.txnRepo.find({
      relations: ['items', 'items.product', 'admin'],
      order: { createdAt: 'DESC' },
    });
  }
}
