import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WebAuthnService } from './webauthn.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth/webauthn')
export class WebAuthnController {
    constructor(private readonly webAuthnService: WebAuthnService) { }

    @UseGuards(JwtAuthGuard)
    @Post('register/start')
    async registerStart(@Request() req) {
        return this.webAuthnService.generateRegistrationOptions(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('register/finish')
    async registerFinish(@Request() req, @Body() body: any) {
        return this.webAuthnService.verifyRegistration(req.user.id, body);
    }

    @Post('login/start')
    async loginStart(@Body('userId') userId: string) {
        // For demo/simple flow we ask for userId. 
        // In real flow we might assume username.
        return this.webAuthnService.generateLoginOptions(userId);
    }

    @Post('login/finish')
    async loginFinish(@Body() body: { userId: string;[key: string]: any }) {
        return this.webAuthnService.verifyLogin(body.userId, body);
    }
}
