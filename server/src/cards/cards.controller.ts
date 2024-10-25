import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
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
    @ApiResponse({status: 201, description: "Returns user data with an added card (number and cvc are encrypted, a field with the last four digits of the card is added for output to the UI)"}) 
    // @Roles(["USER"])
    @UseGuards(RolesGuard)
    @Post() 
    @UsePipes(ValidationPipe)
    create(@Body() dto: CreateCardDto) { 
        return this.cardsService.createCard(dto);
    }

    @ApiOperation({summary: "Get card by id"})
    @ApiResponse({status: 200, type: Card})
    // @Roles(["USER", "WIP-USER", "MANAGER", "ADMIN"])
    @UseGuards(RolesGuard)
    @Get("/:id")
    getUserById(@Param("id") id: number) {
        return this.cardsService.getCardById(id);
    }

    @ApiOperation({summary: "Delete card"})
    @ApiResponse({status: 200, type: Card})
        // @Roles(["USER", "WIP-USER", "MANAGER", "ADMIN"])
    @UseGuards(RolesGuard)
    @Delete("/:id")
    deleteUser(@Param("id") id: number) {
        return this.cardsService.deleteCard(id);
    }

}
