import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Admin } from '../admins/admin.entity';
import { TransactionItem } from './transaction-item.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['IN', 'OUT'] })
  type: 'IN' | 'OUT';

    @Column({ type: 'text', nullable: true })
    note?: string | null;

  @ManyToOne(() => Admin, { nullable: true })
  @JoinColumn({ name: 'admin_id' })
  admin?: Admin | null;


  @OneToMany(() => TransactionItem, (item) => item.transaction, {
    cascade: ['insert'],
  })
  items: TransactionItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
