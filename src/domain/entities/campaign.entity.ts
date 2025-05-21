import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum CampaignStatus {
  ACTIVE = 'ativa',
  PAUSED = 'pausada',
  EXPIRED = 'expirada',
}

export enum CampaignCategory {
  SALES = 'vendas',
  MARKETING = 'marketing',
  SEASONAL = 'sazonal',
  PROMOTIONAL = 'promocional',
  EDUCATIONAL = 'educacional',
}

@Entity()
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'ID único da campanha' })
  id: string;

  @Column()
  @ApiProperty({ description: 'Nome da campanha' })
  nome: string;

  @CreateDateColumn({ type: 'datetime' })
  @ApiProperty({ description: 'Data e hora de criação da campanha' })
  dataCadastro: Date;

  @Column({ type: 'datetime' })
  @ApiProperty({ description: 'Data de início da campanha' })
  dataInicio: Date;

  @Column({ type: 'datetime' })
  @ApiProperty({ description: 'Data de fim da campanha' })
  dataFim: Date;

  @Column({
    type: 'varchar',
    enum: CampaignStatus,
    default: CampaignStatus.ACTIVE,
  })
  @ApiProperty({ 
    description: 'Status da campanha',
    enum: CampaignStatus,
    example: CampaignStatus.ACTIVE
  })
  status: CampaignStatus;

  @Column({
    type: 'varchar',
    enum: CampaignCategory,
  })
  @ApiProperty({ 
    description: 'Categoria da campanha',
    enum: CampaignCategory,
    example: CampaignCategory.MARKETING
  })
  categoria: CampaignCategory;

  @DeleteDateColumn()
  deletedAt?: Date;
} 