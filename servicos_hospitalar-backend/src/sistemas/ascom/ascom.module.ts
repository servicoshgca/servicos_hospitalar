import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AscomService } from './ascom.service';
import { AscomController } from './ascom.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AscomController],
  providers: [AscomService],
  exports: [AscomService],
})
export class AscomModule {} 