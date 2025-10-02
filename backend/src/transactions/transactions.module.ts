import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './transaction.entity';
import { TransactionItem } from './transaction-item.entity';
import { Product } from '../products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, TransactionItem, Product])],
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
