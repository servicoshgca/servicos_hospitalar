import { Controller, Get, Post, UseGuards, UseInterceptors, UploadedFile, Body, Param, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { RefeitorioService } from './refeitorio.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('copa')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class CopaController {
  constructor(private readonly refeitorioService: RefeitorioService) {}

  @Get('configuracao')
  @RequirePermission('refeitorio', 2) // Apenas gestores e administradores do sistema refeitório
  async getConfiguracao() {
    const configs = await this.refeitorioService.getConfiguracoes();
    return configs.length > 0 ? configs[0] : null;
  }

  @Get('pedidos')
  @RequirePermission('refeitorio', 2) // Apenas gestores e administradores do sistema refeitório
  async getPedidos() {
    // Aqui você pode implementar a lógica para buscar pedidos
    // Por enquanto, retornando dados mock
    return {
      pedidos: [],
      total: 0
    };
  }

  @Get('pedidos-dieta')
  @RequirePermission('refeitorio', 2) // Apenas gestores e administradores do sistema refeitório
  async getPedidosDieta() {
    // Aqui você pode implementar a lógica para buscar pedidos de dieta
    // Por enquanto, retornando dados mock
    return {
      pedidos: [],
      total: 0
    };
  }

  @Get('cardapios')
  @RequirePermission('refeitorio', 2)
  async getCardapios() {
    return this.refeitorioService.getCardapios();
  }

  @Get('cardapio/:data')
  @RequirePermission('refeitorio', 2)
  async getCardapioByDate(@Param('data') data: string) {
    const cardapioDate = new Date(data);
    return this.refeitorioService.getCardapioByDate(cardapioDate);
  }

  @Post('cardapio/upload')
  @RequirePermission('refeitorio', 2)
  @UseInterceptors(
    FileInterceptor('cardapio', {
      storage: diskStorage({
        destination: './uploads/cardapios',
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          const filename = `cardapio_${randomName}${extname(file.originalname)}`;
          console.log(`Salvando cardápio: ${filename}`);
          return cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        console.log(`Verificando cardápio: ${file.originalname}, tipo: ${file.mimetype}`);
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|pdf)$/)) {
          return cb(new Error('Apenas arquivos de imagem e PDF são permitidos!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadCardapio(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { data: string }
  ) {
    if (!file) {
      throw new Error('Nenhum arquivo foi enviado');
    }

    const data = new Date(body.data);
    const url = `http://localhost:3001/uploads/cardapios/${file.filename}`;

    return this.refeitorioService.createOrUpdateCardapio({
      data,
      imagem: url,
    });
  }

  @Delete('cardapio/:id')
  @RequirePermission('refeitorio', 2)
  async deleteCardapio(@Param('id') id: string) {
    return this.refeitorioService.deleteCardapio(id);
  }
} 