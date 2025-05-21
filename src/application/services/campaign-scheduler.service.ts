import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Campaign, CampaignStatus } from '../../domain/entities/campaign.entity';

@Injectable()
export class CampaignSchedulerService {
  private readonly logger = new Logger(CampaignSchedulerService.name);

  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
  ) {}

  @Cron('0 * * * * *') // Executa a cada minuto
  async handleExpiredCampaigns() {
    this.logger.debug('Verificando campanhas expiradas...');

    const now = new Date();
    const expiredCampaigns = await this.campaignRepository.find({
      where: {
        dataFim: LessThan(now),
        status: CampaignStatus.ACTIVE,
      },
    });

    if (expiredCampaigns.length > 0) {
      this.logger.debug(`Encontradas ${expiredCampaigns.length} campanhas expiradas`);

      for (const campaign of expiredCampaigns) {
        campaign.status = CampaignStatus.EXPIRED;
        await this.campaignRepository.save(campaign);
        this.logger.debug(`Campanha ${campaign.id} marcada como expirada`);
      }
    }
  }
} 