import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Campaign } from '../../domain/entities/campaign.entity';
import { CampaignService } from './campaign.service';

@Injectable()
export class CampaignSchedulerService {
  private readonly logger = new Logger(CampaignSchedulerService.name);

  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    private readonly campaignService: CampaignService
  ) {}

  @Cron('0 * * * * *') // Executa a cada minuto
  async handleExpiredCampaigns() {
    this.logger.debug('Verificando campanhas expiradas...');

    const now = new Date();
    const campaigns = await this.campaignRepository.find({
      where: {
        dataFim: LessThan(now)
      }
    });

    const updatedCampaigns = await this.campaignService.updateExpiredCampaigns(campaigns);
    
    const expiredCount = updatedCampaigns.filter(campaign => campaign.status === 'expirada').length;
    if (expiredCount > 0) {
      this.logger.debug(`${expiredCount} campanhas foram marcadas como expiradas`);
    }
  }
} 