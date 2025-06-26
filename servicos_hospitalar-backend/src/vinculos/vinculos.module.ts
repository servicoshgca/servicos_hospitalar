import { Module } from '@nestjs/common';
import { VinculosService } from './vinculos.service';
import { VinculosController } from './vinculos.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [VinculosController],
  providers: [VinculosService, PrismaService],
  exports: [VinculosService],
})
export class VinculosModule {} 