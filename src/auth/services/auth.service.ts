import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Bcrypt } from '../bcrypt/bcrypt';
import { UserLogin } from '../entities/userlogin.entity';
import { ClientesService } from '../../clientes/services/clientes.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: ClientesService, 
        private jwtService: JwtService,
        private bcrypt: Bcrypt
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        
        const buscaUsuario = await this.userService.findByEmail(username); 

        if (!buscaUsuario) return null;

        const matchPassword = await this.bcrypt.compararSenhas(password, buscaUsuario.senha);

        if (matchPassword) {
            const { senha, ...resposta } = buscaUsuario;
            return resposta;
        }
        return null;
    }

    async login(user: any) {
        // O payload deve usar o ID real do objeto retornado pelo validateUser
        const payload = { 
            username: user.usuario || user.email, 
            sub: user.id 
        };

        return {
            id: user.id,
            nome: user.nome,
            usuario: user.usuario || user.email,
            foto: user.foto,
            token: `Bearer ${this.jwtService.sign(payload)}`,
        };
    }
}