import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Logger,
  Param,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          const filename = `${randomName}${extname(file.originalname)}`;
          console.log(`Salvando arquivo: ${filename}`);
          return cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        console.log(`Verificando arquivo: ${file.originalname}, tipo: ${file.mimetype}`);
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Apenas arquivos de imagem são permitidos!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    this.logger.log(`Upload recebido: ${file?.originalname || 'nenhum arquivo'}`);
    
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    const result = {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `http://localhost:3001/uploads/${file.filename}`,
    };

    this.logger.log(`Arquivo salvo com sucesso: ${result.filename}`);
    return result;
  }

  @Post('pdf/:funcionarioId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const funcionarioId = req.params.funcionarioId;
          const uploadPath = `./uploads/funcionarios/${funcionarioId}`;
          
          // Criar diretório se não existir
          const fs = require('fs');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          const filename = `${randomName}${extname(file.originalname)}`;
          console.log(`Salvando PDF: ${filename}`);
          return cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        console.log(`Verificando PDF: ${file.originalname}, tipo: ${file.mimetype}`);
        if (!file.originalname.match(/\.(pdf)$/)) {
          return cb(new BadRequestException('Apenas arquivos PDF são permitidos!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  uploadPdf(@UploadedFile() file: Express.Multer.File, @Param('funcionarioId') funcionarioId: string) {
    this.logger.log(`Upload PDF recebido: ${file?.originalname || 'nenhum arquivo'} para funcionário: ${funcionarioId}`);
    
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    const result = {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `http://localhost:3001/uploads/funcionarios/${funcionarioId}/${file.filename}`,
    };

    this.logger.log(`PDF salvo com sucesso: ${result.filename}`);
    return result;
  }

  @Get('test/:funcionarioId/:filename')
  testFile(@Param('funcionarioId') funcionarioId: string, @Param('filename') filename: string) {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'uploads', 'funcionarios', funcionarioId, filename);
    
    this.logger.log(`Testando arquivo: ${filePath}`);
    
    if (fs.existsSync(filePath)) {
      this.logger.log(`Arquivo existe: ${filePath}`);
      return { exists: true, path: filePath, url: `http://localhost:3001/uploads/funcionarios/${funcionarioId}/${filename}` };
    } else {
      this.logger.log(`Arquivo não existe: ${filePath}`);
      return { exists: false, path: filePath };
    }
  }
} 