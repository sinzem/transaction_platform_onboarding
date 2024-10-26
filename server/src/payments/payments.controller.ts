import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PaymentsService } from './payments.service';
import { Payment } from './payments.model';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles-guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { ReplenishmentDto } from './dto/replenishment.dto';
import { WithdrawalDto } from './dto/withdrawal.dto';

@ApiTags("Payments")
@Controller('api/payments')
export class PaymentsController {

    constructor(private paymentsService: PaymentsService) {}

    @ApiOperation({summary: "Depositing money to balance"})
    @ApiResponse({status: 201, type: Payment}) 
    // @Roles(["USER", "WIP-USER", "MANAGER", "ADMIN"])
    // @UseGuards(RolesGuard)
    @Post("/deposit") 
    @UsePipes(ValidationPipe)
    replenishment(@Body() dto: ReplenishmentDto) { 
        return this.paymentsService.replenishment(dto);
    }

    @ApiOperation({summary: "Withdrawing money from user balance"})
    @ApiResponse({status: 201, type: Payment}) 
    // @Roles(["USER", "WIP-USER", "MANAGER", "ADMIN"])
    // @UseGuards(RolesGuard)
    @Post("/withdrawal") 
    @UsePipes(ValidationPipe)
    withdrawal(@Body() dto: WithdrawalDto) { 
        return this.paymentsService.withdrawal(dto);
    }
}
