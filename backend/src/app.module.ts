import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Admin } from './admins/admin.entity';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AdminsModule } from './admins/admins.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST || '127.0.0.1',
      port: parseInt(process.env.DATABASE_PORT || '3306', 10),
      username: process.env.DATABASE_USERNAME || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'deptech_stock',
      autoLoadEntities: true,
      synchronize: false,
      
    }),
    TypeOrmModule.forFeature([Admin]),
    AuthModule,
    CategoriesModule,
    ProductsModule,
    TransactionsModule,
    AdminsModule,
    
  ],
})
export class AppModule {}
