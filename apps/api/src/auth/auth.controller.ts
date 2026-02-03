import { Controller, Request, Post, UseGuards, Body, Get, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) { }

    private setCookies(res: Response, accessToken: string, refreshToken: string) {
        const isProd = this.configService.get('NODE_ENV') === 'production';

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax', // or 'strict' if API/Frontend on same domain
            path: '/',
            maxAge: 15 * 60 * 1000, // 15 mins
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            path: '/auth/refresh', // Restrict to refresh endpoint
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(req.user, req); // Pass req for Audit IP
        this.setCookies(res, result.access_token, result.refresh_token);
        return { user: result.user };
    }

    @Post('register')
    async register(@Body() body: { email: string; password: string; name?: string }, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.register(body.email, body.password, body.name);
        this.setCookies(res, result.access_token, result.refresh_token);
        return { user: result.user };
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Post('refresh')
    async refresh(@Request() req, @Res({ passthrough: true }) res: Response) {
        // Extract from cookie (cookieParser required)
        const refreshToken = req.cookies['refresh_token'];
        if (!refreshToken) return res.status(401).send({ message: 'Refresh token missing' });

        const result = await this.authService.refreshTokens(refreshToken);
        this.setCookies(res, result.access_token, result.refresh_token);
        return { success: true };
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token', { path: '/auth/refresh' });
        return { success: true };
    }

    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        return this.authService.forgotPassword(email);
    }

    @Post('reset-password')
    async resetPassword(@Body() body: { token: string; newPass: string }) {
        return this.authService.resetPassword(body.token, body.newPass);
    }
}
