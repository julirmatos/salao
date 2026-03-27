import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from './clientes/clientes.module';
import { AuthModule } from './auth/auth.module';
import { ProfissionaisModule } from './profissionais/profissionais.module';
import { AdminModule } from './admin/admin.module';
import { ServicosModule } from './servicos/servicos.module';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3310,
      username: 'root',
      password: 'root',
      database: 'db_salao',
      autoLoadEntities: true,
      synchronize: true,
            }),
    AuthModule,ClientesModule,ProfissionaisModule,AdminModule,ServicosModule],
    controllers: [],
  providers: [],
  })
export class AppModule {}