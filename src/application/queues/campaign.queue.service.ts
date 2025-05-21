import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { CreateCampaignDto } from '../../domain/dto/create-campaign.dto';

@Injectable()
export class CampaignQueueService {
  private readonly logger = new Logger(CampaignQueueService.name);

  constructor(
    @InjectQueue('campaign-queue')
    private readonly campaignQueue: Queue,
  ) {}

  async addCreateCampaignJob(createCampaignDto: CreateCampaignDto) {
    try {
      const job = await this.campaignQueue.add('create-campaign', createCampaignDto, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      });
      
      this.logger.debug(`Job ${job.id} adicionado à fila de criação de campanhas`);
      return job;
    } catch (error) {
      this.logger.error(`Erro ao adicionar job à fila: ${error.message}`);
      throw error;
    }
  }
} 