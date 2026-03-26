import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private usuariosService: UsuariosService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, senha: string): Promise<any> {
        
        const usuario = await this.usuariosService.findByEmail(email);

        if (!usuario) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        // remove senha antes de retornar
        const { senha: _, ...usuarioSemSenha } = usuario;

        return usuarioSemSenha;
    }

    async login(user: any) {

        const payload = { 
            sub: user.id,
            email: user.email,
            role: user.role
        };

        return {
            id: user.id,
            nome: user.nome,
            email: user.email,
            role: user.role,
            access_token: this.jwtService.sign(payload)
        };
    }
}