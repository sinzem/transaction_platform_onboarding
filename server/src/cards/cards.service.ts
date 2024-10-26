import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createDecipheriv, createCipheriv } from 'crypto';

import { InjectModel } from '@nestjs/sequelize';
import { Card } from './cards.model';
import { UsersService } from 'src/users/users.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CardsService {

    constructor(@InjectModel(Card) private cardRepository: typeof Card,
                    private authService: AuthService,
                    private userService: UsersService) {}

    async createCard(dto: CreateCardDto) {
        const payload = await this.authService.getPayload();
        let user = await this.userService.getUserById(payload.id);
        let num = dto.cardNumber;
        let cardNumberHidden = '';
        dto.cardNumber.split('').forEach((i, j)=>j<12&&j>=0?cardNumberHidden+="*":cardNumberHidden+=i);
        const cardNumberEncrypted = await this.encryptData(num);
        const cvcEncrypted = await this.encryptData(dto.cardCvc);
        const card = await this.cardRepository.create({...dto, userId: user.id, cardNumber: cardNumberEncrypted, cardNumberHidden, cardCvc: cvcEncrypted});
        user = await this.userService.getUserById(payload.id);
        return user;
    }

    async getCardById(id: number) {
        let card = await this.cardRepository.findOne({where: {id}});
        this.checkCard(card);
        const check = await this.authService.checkUserOwnership(card);
        if (!check) {
            throw new HttpException("This is not your card", HttpStatus.FORBIDDEN); 
        } else {
            const decipherCardNum = await this.decryptData(card.cardNumber);
            const decipherCvc = await this.decryptData(card.cardCvc);
            card.cardNumber = decipherCardNum;
            card.cardCvc = decipherCvc;
            return card;
        }
    }

    async getCardByNumber(number: string) {
        let card = await this.cardRepository.findAll({where: {cardNumber: number}});
        this.checkCard(card);
        return card;
    }

    async deleteCard(id: number) {
        let card = await this.cardRepository.findOne({where: {id}});
        this.checkCard(card);
        const check = await this.authService.checkUserOwnership(card);
        if (!check) {
            throw new HttpException("This is not your card", HttpStatus.FORBIDDEN); 
        } else {
            await this.cardRepository.destroy({where: {id}});
            return card;
        }
    }

    async encryptData(str) {
        const key = Buffer.from(process.env.CARD_KEY, "hex");
        const iv = Buffer.from(process.env.CARD_IV, "hex");
        const cipher = createCipheriv("aes-256-cbc", key, iv);
        let encrypted = cipher.update(str, "utf-8", "base64");
        encrypted += cipher.final("base64");
        return encrypted;
    }

    async decryptData(str) {
        const key = Buffer.from(process.env.CARD_KEY, "hex");
        const iv = Buffer.from(process.env.CARD_IV, "hex");
        const decipher = createDecipheriv("aes-256-cbc", key, iv);
        let decrypted = decipher.update(str, "base64", "utf-8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }

    checkCard(card: any) {
        if (!card) {
            throw new HttpException("Card not found", HttpStatus.NOT_FOUND);
        }
    }
}


