import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { User } from 'src/users/users.model';
import { Card } from './cards.model';

@Module({
    providers: [CardsService],
    controllers: [CardsController],
    imports: [
      SequelizeModule.forFeature([User, Card]),
    ],
    exports: [
        CardsService
    ]
})
export class CardsModule {}
