import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../../auth/decorators/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../usuarios/enums/role.enum';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {

  // 🔒 Teste simples
  @Get()
  getAdmin() {
    return {
      mensagem: 'Acesso permitido: ADMIN',
    };
  }

  // 📊 futuro dashboard (placeholder)
  @Get('dashboard')
  getDashboard() {
    return {
      mensagem: 'Dashboard admin (em construção)',
    };
  }
}