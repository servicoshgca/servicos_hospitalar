import { Module } from '@nestjs/common';
import { SistemasService } from './sistemas.service';
import { SistemasController } from './sistemas.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SistemasController],
  providers: [SistemasService, PrismaService],
  exports: [SistemasService],
})
export class SistemasModule {} 