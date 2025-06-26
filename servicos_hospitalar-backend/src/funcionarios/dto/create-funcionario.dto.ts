import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested, IsDate, IsNumber, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInformacaoFuncionalDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  matricula: string;

  @IsString()
  setorId: string;

  @IsString()
  cargo: string;

  @IsString()
  vinculoId: string;

  @IsOptional()
  @IsString()
  situacao?: string;

  @IsString()
  dataAdmissao: string;

  @IsOptional()
  @IsString()
  dataDemissao?: string;

  @IsString()
  cargaHoraria: string;

  @IsOptional()
  @IsNumber()
  salario?: number;

  @IsOptional()
  @IsBoolean()
  refeicao?: boolean;

  @IsOptional()
  @IsString()
  numeroPastaFisica?: string;

  @IsOptional()
  @IsString()
  rhBahia?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

export class CreateFuncionarioDto {
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  nomeSocial?: string;

  @IsOptional()
  @IsString()
  genero?: string;

  @IsString()
  cpf: string;

  @IsOptional()
  @IsString()
  rg?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataExpedicaoRg?: Date;

  @IsOptional()
  @IsString()
  orgaoExpedidorRg?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataNascimento?: Date;

  @IsOptional()
  @IsString()
  naturalidade?: string;

  @IsOptional()
  @IsString()
  nacionalidade?: string;

  @IsOptional()
  @IsString()
  estadoCivil?: string;

  @IsOptional()
  @IsString()
  nomeMae?: string;

  @IsOptional()
  @IsString()
  nomePai?: string;

  @IsOptional()
  @IsString()
  tipoSanguineo?: string;

  @IsOptional()
  @IsString()
  fatorRh?: string;

  @IsOptional()
  @IsString()
  foto?: string;

  // Documentos
  @IsOptional()
  @IsString()
  tituloEleitor?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataEmissaoTitulo?: Date;

  @IsOptional()
  @IsString()
  zonaEleitoral?: string;

  @IsOptional()
  @IsString()
  secaoEleitoral?: string;

  @IsOptional()
  @IsString()
  pisPasep?: string;

  @IsOptional()
  @IsString()
  ctps?: string;

  @IsOptional()
  @IsString()
  serieCtps?: string;

  @IsOptional()
  @IsString()
  cartaoSus?: string;

  @IsOptional()
  @IsString()
  conselhoProfissional?: string;

  @IsOptional()
  @IsString()
  numeroConselho?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataExpedicaoConselho?: Date;

  @IsOptional()
  @IsString()
  numeroReservista?: string;

  @IsOptional()
  @IsString()
  ministerio?: string;

  @IsOptional()
  @IsBoolean()
  dispensado?: boolean;

  // Contatos e Endereço
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  telefoneResidencial?: string;

  @IsOptional()
  @IsString()
  telefoneCelular?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  cep?: string;

  @IsOptional()
  @IsString()
  bairro?: string;

  @IsOptional()
  @IsString()
  complemento?: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  // Estacionamento e Veículo
  @IsOptional()
  @IsString()
  numeroEstacionamento?: string;

  @IsOptional()
  @IsString()
  placaVeiculo?: string;

  @IsOptional()
  @IsString()
  tipoVeiculo?: string;

  // Formação Acadêmica
  @IsOptional()
  @IsString()
  grauEscolaridade?: string;

  @IsOptional()
  @IsString()
  faculdade?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataIngresso?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataConclusao?: Date;

  @IsOptional()
  @IsString()
  formacaoProfissional?: string;

  @IsOptional()
  @IsString()
  cbo?: string;

  // Observações
  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInformacaoFuncionalDto)
  informacoesFuncionais: CreateInformacaoFuncionalDto[];
} 