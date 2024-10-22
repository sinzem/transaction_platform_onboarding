import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MailService } from './mail.service';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { FeedbackDto } from './dto/feedback-service.dto';

@ApiTags("Sending emails")
@Controller('/mail')
export class MailController {

    constructor(private usersService: MailService) {}

    @ApiOperation({summary: "Feedback"})
    @ApiResponse({status: 201, description: "Letter sent"}) 
    @Post() 
    @UsePipes(ValidationPipe)
    create(@Body() dto: FeedbackDto) { 
        const toAdmin = {
            to: `${process.env.MAIL_ADMIN}`,
            from: `${process.env.MAIL_SENDER}`,
            subject: `Letter to administrator from ${dto.name}, ${dto.mail}`
        }
        return this.usersService.sendMessage({...dto, ...toAdmin});
    }

}
