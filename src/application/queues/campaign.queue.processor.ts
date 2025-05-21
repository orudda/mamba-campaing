import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { CampaignService } from '../services/campaign.service';
import { CreateCampaignDto } from '../../domain/dto/create-campaign.dto';

@Processor('campaign-queue')
export class CampaignQueueProcessor {
  private readonly logger = new Logger(CampaignQueueProcessor.name);

  constructor(private readonly campaignService: CampaignService) {}

  @Process('create-campaign')
  async handleCreateCampaign(job: Job<CreateCampaignDto>) {
    this.logger.debug(`Processando job ${job.id} para criar campanha`);
    try {
      const campaign = await this.campaignService.create(job.data);
      this.logger.debug(`Campanha ${campaign.id} criada com sucesso`);
      return campaign;
    } catch (error) {
      this.logger.error(`Erro ao criar campanha: ${error.message}`);
      throw error;
    }
  }
} 