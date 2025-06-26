import { Module } from '@nestjs/common';
import { FuncionarioEtiquetasController } from './funcionario-etiquetas.controller';
import { FuncionarioEtiquetasService } from './funcionario-etiquetas.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    LogsModule,
    JwtModule.register({}),
  ],
  controllers: [FuncionarioEtiquetasController],
  providers: [FuncionarioEtiquetasService],
  exports: [FuncionarioEtiquetasService],
})
export class FuncionarioEtiquetasModule {} 