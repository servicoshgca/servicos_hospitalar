import { Module } from '@nestjs/common';
import { RelatoriosController } from './relatorios.controller';
import { RelatoriosService } from './relatorios.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [RelatoriosController],
  providers: [RelatoriosService],
  exports: [RelatoriosService],
})
export class RelatoriosModule {} 