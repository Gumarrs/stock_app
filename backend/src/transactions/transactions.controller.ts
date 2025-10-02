import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private txnService: TransactionsService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateTransactionDto) {
    const adminId = req.user?.adminId;
    return this.txnService.create(adminId, dto);
  }

  @Get()
  findAll() {
    return this.txnService.findAll();
  }
}
