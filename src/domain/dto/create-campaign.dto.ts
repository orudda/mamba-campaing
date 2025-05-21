import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsDate, IsString, MinDate } from 'class-validator';
import { Type } from 'class-transformer';
import { CampaignCategory, CampaignStatus } from '../entities/campaign.entity';

export class CreateCampaignDto {
  @ApiProperty({ description: 'Nome da campanha' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({ description: 'Data de início da campanha' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @MinDate(new Date())
  dataInicio: Date;

  @ApiProperty({ description: 'Data de fim da campanha' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dataFim: Date;

  @ApiProperty({ enum: CampaignStatus, example: CampaignStatus.ACTIVE })
  @IsNotEmpty()
  @IsEnum(CampaignStatus)
  status: CampaignStatus;

  @ApiProperty({ enum: CampaignCategory, example: CampaignCategory.MARKETING })
  @IsNotEmpty()
  @IsEnum(CampaignCategory)
  categoria: CampaignCategory;
} 