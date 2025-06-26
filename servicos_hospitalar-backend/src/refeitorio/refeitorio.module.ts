import { Module } from '@nestjs/common';
import { RefeitorioController } from './refeitorio.controller';
import { CopaController } from './copa.controller';
import { RefeitorioService } from './refeitorio.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule],
  controllers: [RefeitorioController, CopaController],
  providers: [RefeitorioService],
  exports: [RefeitorioService],
})
export class RefeitorioModule {} 