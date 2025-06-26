import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LogsInterceptor } from './logs/logs.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Aplicar interceptor globalmente para capturar IP e User-Agent
  app.useGlobalInterceptors(new LogsInterceptor());
  
  // Configurar CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  
  // Configurar arquivos estáticos - usar caminho absoluto
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
