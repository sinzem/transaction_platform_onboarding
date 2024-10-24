import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CardsService } from './cards.service';
import { Card } from './cards.model';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles-guard';
import { CreateCardDto } from './dto/create-card.dto';

@ApiTags("Cards")
@Controller('api/cards')
export class CardsController {

    constructor(private cardsService: CardsService) {}

    @ApiOperation({summary: "Creating card and add to user"})
    @ApiResponse({status: 201, type: Card}) 
    // @Roles(["USER"])
    @UseGuards(RolesGuard)
    @Post() 
    @UsePipes(ValidationPipe)
    create(@Body() dto: CreateCardDto) { 
        return this.cardsService.createCard(dto);
    }

}
