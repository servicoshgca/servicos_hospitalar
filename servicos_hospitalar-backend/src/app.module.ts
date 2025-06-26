import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { SistemasModule } from './sistemas/sistemas.module';
import { FuncionariosModule } from './funcionarios/funcionarios.module';
import { SetoresModule } from './setores/setores.module';
import { UploadModule } from './upload/upload.module';
import { VinculosModule } from './vinculos/vinculos.module';
import { AscomModule } from './sistemas/ascom/ascom.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuthModule } from './auth/auth.module';
import { TiposEtiquetasModule } from './tipos-etiquetas/tipos-etiquetas.module';
import { LogsModule } from './logs/logs.module';
import { FuncionarioEtiquetasModule } from './funcionario-etiquetas/funcionario-etiquetas.module';
import { RelatoriosModule } from './relatorios/relatorios.module';
import { RefeitorioModule } from './refeitorio/refeitorio.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    UsersModule,
    SistemasModule,
    FuncionariosModule,
    SetoresModule,
    UploadModule,
    VinculosModule,
    AscomModule,
    PermissionsModule,
    AuthModule,
    TiposEtiquetasModule,
    FuncionarioEtiquetasModule,
    LogsModule,
    RelatoriosModule,
    RefeitorioModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
