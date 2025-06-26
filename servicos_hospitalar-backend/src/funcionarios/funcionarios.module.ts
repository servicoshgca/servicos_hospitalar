import { Module } from '@nestjs/common';
import { FuncionariosService } from './funcionarios.service';
import { FuncionariosController } from './funcionarios.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { LogsModule } from '../logs/logs.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    LogsModule,
    JwtModule.register({}),
  ],
  controllers: [FuncionariosController],
  providers: [FuncionariosService],
  exports: [FuncionariosService],
})
export class FuncionariosModule {} 