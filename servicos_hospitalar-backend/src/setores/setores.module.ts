import { Module } from '@nestjs/common';
import { SetoresService } from './setores.service';
import { SetoresController } from './setores.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [SetoresController],
  providers: [SetoresService, PrismaService],
  exports: [SetoresService],
})
export class SetoresModule {} 