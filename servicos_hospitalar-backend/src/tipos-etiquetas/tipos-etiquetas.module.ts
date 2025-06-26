import { Module } from '@nestjs/common';
import { TiposEtiquetasService } from './tipos-etiquetas.service';
import { TiposEtiquetasController } from './tipos-etiquetas.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),
    UsersModule,
    LogsModule,
  ],
  controllers: [TiposEtiquetasController],
  providers: [TiposEtiquetasService],
  exports: [TiposEtiquetasService],
})
export class TiposEtiquetasModule {} 