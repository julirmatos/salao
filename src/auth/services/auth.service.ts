import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Bcrypt } from '../bcrypt/bcrypt';
import { UserLogin } from '../entities/userlogin.entity';

@Injectable()
export class AuthService {
    constructor(
        private UserService: UserService,
        private jwtService: JwtService,
        private bcrypt: Bcrypt
    ) { }

    async validateUser(username: string, password: string): Promise<any> {

        const buscaUsuario = await this.UserService.findByUsuario(username)

        if (!buscaUsuario)
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND)

        const matchPassword = await this.bcrypt.compararSenhas(buscaUsuario.senha, password)

        if (buscaUsuario && matchPassword) {
            const { senha, ...resposta } = buscaUsuario
            return resposta
        }

        return null
    }

    async login(usuarioLogin: UserLogin) {
        const payload = { sub: usuarioLogin.cliente }

        const buscaUsuario = await this.UserService.findByUsuario(usuarioLogin.cliente)

        return {
            id: buscaUsuario?.id,
            nome: buscaUsuario?.nome,
            usuario: usuarioLogin.cliente,
            senha: '',
            foto: buscaUsuario?.foto,
            token: `Bearer ${this.jwtService.sign(payload)}`,
        }

    }
}