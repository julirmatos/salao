import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'segredo-super-seguro',
    });
  }

  async validate(payload: any) {
    // 'sub' é o ID do usuário guardado no token
    return { userId: payload.sub, email: payload.email };
  }
}