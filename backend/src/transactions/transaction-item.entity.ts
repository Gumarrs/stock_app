import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Product } from '../products/product.entity';

@Entity('transaction_items')
export class TransactionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Transaction, (txn) => txn.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int' })
  qty: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: true })
   price?: number | null;
}
