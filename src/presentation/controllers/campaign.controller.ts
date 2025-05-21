import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CampaignService } from '../../application/services/campaign.service';
import { CreateCampaignDto } from '../../domain/dto/create-campaign.dto';
import { UpdateCampaignDto } from '../../domain/dto/update-campaign.dto';
import { Campaign } from '../../domain/entities/campaign.entity';

@ApiTags('Campanhas')
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova campanha' })
  @ApiResponse({ status: 201, description: 'Campanha criada com sucesso', type: Campaign })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    return this.campaignService.create(createCampaignDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as campanhas ativas' })
  @ApiResponse({ status: 200, description: 'Lista de campanhas retornada com sucesso', type: [Campaign] })
  findAll(): Promise<Campaign[]> {
    return this.campaignService.findAll();
  }

  @Get('all')
  @ApiOperation({ summary: 'Listar todas as campanhas (incluindo deletadas)' })
  @ApiResponse({ status: 200, description: 'Lista completa de campanhas retornada com sucesso', type: [Campaign] })
  findAllWithDeleted(): Promise<Campaign[]> {
    return this.campaignService.findAllWithDeleted();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma campanha pelo ID' })
  @ApiResponse({ status: 200, description: 'Campanha encontrada com sucesso', type: Campaign })
  @ApiResponse({ status: 404, description: 'Campanha não encontrada' })
  findOne(@Param('id') id: string): Promise<Campaign> {
    return this.campaignService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma campanha' })
  @ApiResponse({ status: 200, description: 'Campanha atualizada com sucesso', type: Campaign })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Campanha não encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ): Promise<Campaign> {
    return this.campaignService.update(id, updateCampaignDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma campanha (soft delete)' })
  @ApiResponse({ status: 200, description: 'Campanha removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Campanha não encontrada' })
  remove(@Param('id') id: string): Promise<void> {
    return this.campaignService.remove(id);
  }
} 