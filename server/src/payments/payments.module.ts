import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { User } from 'src/users/users.model';
import { Card } from 'src/cards/cards.model';
import { Payment } from './payments.model';
import { UsersModule } from 'src/users/users.module';
import { CardsModule } from 'src/cards/cards.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [PaymentsService],
  controllers: [PaymentsController],
  imports: [
    SequelizeModule.forFeature([User, Card, Payment]),
    UsersModule,
    CardsModule,
    AuthModule
  ],
  exports: [PaymentsService]
})
export class PaymentsModule {}
