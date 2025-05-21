import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Campaign, CampaignStatus } from '../../domain/entities/campaign.entity';
import { CreateCampaignDto } from '../../domain/dto/create-campaign.dto';
import { UpdateCampaignDto } from '../../domain/dto/update-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const { dataInicio, dataFim } = createCampaignDto;

    if (new Date(dataInicio) < new Date()) {
      throw new BadRequestException('A data de início deve ser igual ou posterior à data atual');
    }

    if (new Date(dataFim) <= new Date(dataInicio)) {
      throw new BadRequestException('A data fim deve ser posterior à data início');
    }

    const campaign = this.campaignRepository.create(createCampaignDto);
    return this.campaignRepository.save(campaign);
  }

  async findAll(): Promise<Campaign[]> {
    const campaigns = await this.campaignRepository.find();
    return this.updateExpiredCampaigns(campaigns);
  }

  async findOne(id: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({ where: { id } });
    if (!campaign) {
      throw new NotFoundException(`Campanha com ID ${id} não encontrada`);
    }
    return this.updateExpiredCampaigns([campaign])[0];
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto): Promise<Campaign> {
    const campaign = await this.findOne(id);

    if (updateCampaignDto.dataInicio && updateCampaignDto.dataFim) {
      if (new Date(updateCampaignDto.dataFim) <= new Date(updateCampaignDto.dataInicio)) {
        throw new BadRequestException('A data fim deve ser posterior à data início');
      }
    } else if (updateCampaignDto.dataInicio && !updateCampaignDto.dataFim) {
      if (new Date(campaign.dataFim) <= new Date(updateCampaignDto.dataInicio)) {
        throw new BadRequestException('A data fim deve ser posterior à data início');
      }
    } else if (!updateCampaignDto.dataInicio && updateCampaignDto.dataFim) {
      if (new Date(updateCampaignDto.dataFim) <= new Date(campaign.dataInicio)) {
        throw new BadRequestException('A data fim deve ser posterior à data início');
      }
    }

    Object.assign(campaign, updateCampaignDto);
    return this.campaignRepository.save(campaign);
  }

  async remove(id: string): Promise<void> {
    const campaign = await this.findOne(id);
    await this.campaignRepository.softDelete(id);
  }

  public async updateExpiredCampaigns(campaigns: Campaign[]): Promise<Campaign[]> {
    const now = new Date();
    return campaigns.map(campaign => {
      if (new Date(campaign.dataFim) < now && campaign.status !== CampaignStatus.EXPIRED) {
        campaign.status = CampaignStatus.EXPIRED;
        this.campaignRepository.save(campaign);
      }
      return campaign;
    });
  }
} 