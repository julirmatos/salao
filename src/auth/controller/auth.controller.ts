import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Req } from '@nestjs/common';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { UserLogin } from './../entities/userlogin.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Login')
@Controller("/login")
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('/logar')
    // O Passport coloca o usuário validado em req.user
    async login(@Req() req: any): Promise<any> {
        return this.authService.login(req.user);
    }
}