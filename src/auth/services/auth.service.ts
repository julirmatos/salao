import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserLogin } from '../entities/userlogin.entity';
import { ClientesService } from '../../clientes/services/clientes.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: ClientesService, 
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        
        const buscaUsuario = await this.userService.findByEmail(username); 

        if (!buscaUsuario) return null;

        // 🔥 CORREÇÃO AQUI
        const matchPassword = await bcrypt.compare(password, buscaUsuario.senha);

        if (matchPassword) {
            const { senha, ...resposta } = buscaUsuario;
            return resposta;
        }

        return null;
    }

    async login(user: any) {
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