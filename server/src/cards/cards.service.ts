import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Card } from './cards.model';
import { UsersService } from 'src/users/users.service';
import { CreateCardDto } from './dto/create-card.dto';
import { createDecipheriv, createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class CardsService {

    constructor(@InjectModel(Card) private cardRepository: typeof Card,
                    private userService: UsersService) {}

    async createCard(dto: CreateCardDto) {
        const key = Buffer.from(process.env.CARD_KEY, "hex");
        const iv = Buffer.from(process.env.CARD_IV, "hex");
        // let num = dto.cardNumber;
        // let cardNumberHidden = '';
        // dto.cardNumber.split('').forEach((i, j)=>j<12&&j>=0?cardNumberHidden+="*":cardNumberHidden+=i);
        const cardNumberEncrypted = await this.encryptData(dto.cardNumber, key, iv);
        const back = await this.decryptData(cardNumberEncrypted, key, iv);
        return back;
    }

    async encryptData(str, pass, iv) {
        const cipher = createCipheriv("aes-256-cbc", pass, iv);
        let encrypted = cipher.update(str, "utf-8", "base64");
        encrypted += cipher.final("base64");
        return encrypted;
    }

    async decryptData(str, pass, iv) {
        const decipher = createDecipheriv("aes-256-cbc", pass, iv);
        let decrypted = decipher.update(str, "base64", "utf-8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }
    
}


