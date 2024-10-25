import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './payments.model';
import { UsersService } from 'src/users/users.service';
import { CardsService } from 'src/cards/cards.service';
import { AuthService } from 'src/auth/auth.service';
import { ReplenishmentDto } from './dto/replenishment.dto';
import { WithdrawalDto } from './dto/withdrawal.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class PaymentsService {

    constructor(@InjectModel(Payment) private paymentRepository: typeof Payment,
                                    private authService: AuthService,
                                    private userService: UsersService,
                                    private cardService: CardsService) {}

    async replenishment(dto: ReplenishmentDto) {
        const payload = await this.authService.getPayload();
        const userId = payload.id;
        const payNumber = await this.genPayNumber();
        const cardNumberHidden = this.cardHidden(dto.cardNumber);
        const type = "deposit";
        const user = await this.userService.getUserById(userId);
        const cardEnc = await this.cardService.encryptData(dto.cardNumber);
        const checkCard = await this.cardService.getCardByNumber(cardEnc);
        let card;
        if (!checkCard || checkCard.length === 0) {
            card = await this.cardService.createCard(dto);
        } else {
            card = checkCard[0];
        }
        if (+(card.cardBalance) < +(dto.sum)) {
            throw new HttpException("Not enough money", HttpStatus.BAD_REQUEST);
        } else {
            user.balance = (+(user.balance) + +(dto.sum)).toFixed(2);
            card.cardBalance = (+(card.cardBalance) - +(dto.sum)).toFixed(2);
            await user.save();
            await card.save();
            const status = "completed";
            const check = await this.paymentRepository.create({...dto, userId, payNumber, cardNumberHidden, status, type});
            return check;
        }
    }

    async withdrawal(dto: WithdrawalDto) {

    }

    private cardHidden(str) {
        let cardNum = "";
        str.split('').forEach((i, j)=>j<12&&j>3?cardNum+="*":cardNum+=i);
        return cardNum;
    }

    async genPayNumber() {
        const payNumber = randomBytes(12).toString("hex").toUpperCase().slice(12);
        const checkPayNumber = await this.paymentRepository.findOne({where: {payNumber}});
        if (!checkPayNumber) {
            return payNumber;
        } else {
            this.genPayNumber();
        }
    }
}
