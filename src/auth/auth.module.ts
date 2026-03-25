import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { ClientesModule } from '../clientes/clientes.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';


@Module({
  imports: [
    ClientesModule,
    JwtModule.register({
      secret: 'segredo-super-seguro',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
})
export class AuthModule {}