import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { User } from 'src/users/users.model';
import { Card } from './cards.model';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    providers: [CardsService],
    controllers: [CardsController],
    imports: [
      SequelizeModule.forFeature([User, Card]),
      UsersModule,
      AuthModule
    ],
    exports: [
        CardsService
    ]
})
export class CardsModule {}
