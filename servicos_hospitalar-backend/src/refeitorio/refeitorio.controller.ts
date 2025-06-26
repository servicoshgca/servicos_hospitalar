import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Request } from '@nestjs/common';
import { RefeitorioService } from './refeitorio.service';
import { CreateConfiguracaoRefeitorioDto, UpdateConfiguracaoRefeitorioDto, CreatePedidoRefeicaoDto, UpdatePedidoRefeicaoDto, CreatePedidoEntregueDto, UpdatePedidoEntregueDto, CreatePedidoNaoEntregueDto, UpdatePedidoNaoEntregueDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('refeitorio')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class RefeitorioController {
  constructor(private readonly refeitorioService: RefeitorioService) {}

  @Get('configuracao')
  @RequirePermission('refeitorio', 1)
  async getConfiguracao() {
    const configs = await this.refeitorioService.getConfiguracoes();
    return configs.length > 0 ? configs[0] : null;
  }

  @Get('configuracoes')
  @RequirePermission('refeitorio', 1)
  getConfiguracoes() {
    return this.refeitorioService.getConfiguracoes();
  }

  @Get('configuracoes/:id')
  @RequirePermission('refeitorio', 1)
  getConfiguracaoById(@Param('id') id: string) {
    return this.refeitorioService.getConfiguracaoById(id);
  }

  @Post('configuracao')
  @RequirePermission('refeitorio', 2)
  createConfiguracao(@Body() createConfiguracaoRefeitorioDto: CreateConfiguracaoRefeitorioDto) {
    return this.refeitorioService.createOrUpdateConfiguracao(createConfiguracaoRefeitorioDto);
  }

  @Post('configuracoes')
  @RequirePermission('refeitorio', 2)
  createConfiguracaoLegacy(@Body() createConfiguracaoRefeitorioDto: CreateConfiguracaoRefeitorioDto) {
    return this.refeitorioService.createConfiguracao(createConfiguracaoRefeitorioDto);
  }

  @Put('configuracao/:id')
  @RequirePermission('refeitorio', 2)
  updateConfiguracao(
    @Param('id') id: string,
    @Body() updateConfiguracaoRefeitorioDto: UpdateConfiguracaoRefeitorioDto,
  ) {
    return this.refeitorioService.updateConfiguracao(id, updateConfiguracaoRefeitorioDto);
  }

  @Patch('configuracoes/:id')
  @RequirePermission('refeitorio', 2)
  updateConfiguracaoLegacy(
    @Param('id') id: string,
    @Body() updateConfiguracaoRefeitorioDto: UpdateConfiguracaoRefeitorioDto,
  ) {
    return this.refeitorioService.updateConfiguracao(id, updateConfiguracaoRefeitorioDto);
  }

  @Delete('configuracoes/:id')
  @RequirePermission('refeitorio', 2)
  deleteConfiguracao(@Param('id') id: string) {
    return this.refeitorioService.deleteConfiguracao(id);
  }

  // Endpoints para pedidos de refeição
  @Get('pedidos')
  @RequirePermission('refeitorio', 1)
  getPedidosRefeicao() {
    return this.refeitorioService.getPedidosRefeicao();
  }

  @Get('pedidos/funcionario')
  @RequirePermission('refeitorio', 1)
  async getPedidosRefeicaoByFuncionario(@Request() req) {
    const funcionarioId = req.user.funcionario.id;
    
    if (!funcionarioId) {
      throw new Error('Funcionário não encontrado para o usuário autenticado');
    }

    return this.refeitorioService.getPedidosRefeicaoByFuncionario(funcionarioId);
  }

  @Get('pedidos/data/:data')
  @RequirePermission('refeitorio', 1)
  getPedidosRefeicaoByDate(@Param('data') data: string) {
    // Corrigir o filtro de data para UTC
    const startOfDay = new Date(data + 'T00:00:00.000Z');
    const endOfDay = new Date(data + 'T23:59:59.999Z');
    return this.refeitorioService.getPedidosRefeicaoByDateRange(startOfDay, endOfDay);
  }

  @Post('pedidos')
  @RequirePermission('refeitorio', 1)
  async createPedidoRefeicao(@Request() req, @Body() createPedidoRefeicaoDto: CreatePedidoRefeicaoDto) {
    const funcionarioId = req.user.funcionario.id;
    
    if (!funcionarioId) {
      throw new Error('Funcionário não encontrado para o usuário autenticado');
    }

    return this.refeitorioService.createPedidoRefeicao(funcionarioId, createPedidoRefeicaoDto);
  }

  @Put('pedidos/:id')
  @RequirePermission('refeitorio', 2)
  updatePedidoRefeicao(
    @Param('id') id: string,
    @Body() updatePedidoRefeicaoDto: UpdatePedidoRefeicaoDto,
  ) {
    return this.refeitorioService.updatePedidoRefeicao(id, updatePedidoRefeicaoDto);
  }

  @Delete('pedidos/:id')
  @RequirePermission('refeitorio', 2)
  deletePedidoRefeicao(@Param('id') id: string) {
    return this.refeitorioService.deletePedidoRefeicao(id);
  }

  // Endpoints para pedidos entregues
  @Get('pedidos/entregues')
  @RequirePermission('refeitorio', 2)
  getPedidosEntregues() {
    return this.refeitorioService.getPedidosEntregues();
  }

  @Get('pedidos/entregues/data/:data')
  @RequirePermission('refeitorio', 2)
  getPedidosEntreguesByDate(@Param('data') data: string) {
    return this.refeitorioService.getPedidosEntreguesByDate(new Date(data));
  }

  @Get('pedidos/entregues/tipo/:tipoRefeicao/data/:data')
  @RequirePermission('refeitorio', 2)
  getPedidosEntreguesByTipoRefeicao(
    @Param('tipoRefeicao') tipoRefeicao: string,
    @Param('data') data: string
  ) {
    return this.refeitorioService.getPedidosEntreguesByTipoRefeicao(tipoRefeicao, new Date(data));
  }

  @Get('funcionario/cpf/:cpf')
  @RequirePermission('refeitorio', 2)
  getFuncionarioByCpf(@Param('cpf') cpf: string) {
    return this.refeitorioService.getFuncionarioByCpf(cpf);
  }

  @Post('pedidos/entregues')
  @RequirePermission('refeitorio', 2)
  async createPedidoEntregue(@Body() createPedidoEntregueDto: CreatePedidoEntregueDto) {
    return this.refeitorioService.createPedidoEntregue(createPedidoEntregueDto);
  }

  @Put('pedidos/entregues/:id')
  @RequirePermission('refeitorio', 2)
  updatePedidoEntregue(
    @Param('id') id: string,
    @Body() updatePedidoEntregueDto: UpdatePedidoEntregueDto,
  ) {
    return this.refeitorioService.updatePedidoEntregue(id, updatePedidoEntregueDto);
  }

  @Delete('pedidos/entregues/:id')
  @RequirePermission('refeitorio', 2)
  deletePedidoEntregue(@Param('id') id: string) {
    return this.refeitorioService.deletePedidoEntregue(id);
  }

  // Endpoints para pedidos não entregues
  @Get('pedidos/nao-entregues')
  @RequirePermission('refeitorio', 2)
  getPedidosNaoEntregues() {
    return this.refeitorioService.getPedidosNaoEntregues();
  }

  @Get('pedidos/nao-entregues/data/:data')
  @RequirePermission('refeitorio', 2)
  getPedidosNaoEntreguesByDate(@Param('data') data: string) {
    return this.refeitorioService.getPedidosNaoEntreguesByDate(new Date(data));
  }

  @Get('pedidos/nao-entregues/tipo/:tipoRefeicao/data/:data')
  @RequirePermission('refeitorio', 2)
  getPedidosNaoEntreguesByTipoRefeicao(
    @Param('tipoRefeicao') tipoRefeicao: string,
    @Param('data') data: string
  ) {
    return this.refeitorioService.getPedidosNaoEntreguesByTipoRefeicao(tipoRefeicao, new Date(data));
  }

  @Post('pedidos/nao-entregues')
  @RequirePermission('refeitorio', 2)
  async createPedidoNaoEntregue(@Body() createPedidoNaoEntregueDto: CreatePedidoNaoEntregueDto) {
    return this.refeitorioService.createPedidoNaoEntregue(createPedidoNaoEntregueDto);
  }

  @Put('pedidos/nao-entregues/:id')
  @RequirePermission('refeitorio', 2)
  updatePedidoNaoEntregue(
    @Param('id') id: string,
    @Body() updatePedidoNaoEntregueDto: UpdatePedidoNaoEntregueDto,
  ) {
    return this.refeitorioService.updatePedidoNaoEntregue(id, updatePedidoNaoEntregueDto);
  }

  @Delete('pedidos/nao-entregues/:id')
  @RequirePermission('refeitorio', 2)
  deletePedidoNaoEntregue(@Param('id') id: string) {
    return this.refeitorioService.deletePedidoNaoEntregue(id);
  }

  // Endpoints para cardápio
  @Get('cardapio/:data')
  @RequirePermission('refeitorio', 1)
  async getCardapioByDate(@Param('data') data: string) {
    const cardapioDate = new Date(data);
    return this.refeitorioService.getCardapioByDate(cardapioDate);
  }

  // Endpoints para buscar setores disponíveis
  @Get('setores')
  @RequirePermission('refeitorio', 1)
  async getSetores() {
    return this.refeitorioService.getSetores();
  }
} 