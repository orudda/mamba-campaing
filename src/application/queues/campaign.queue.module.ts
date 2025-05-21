import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CampaignQueueProcessor } from './campaign.queue.processor';
import { CampaignQueueService } from './campaign.queue.service';
import { CampaignModule } from '../modules/campaign.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'campaign-queue',
    }),
    CampaignModule,
  ],
  providers: [CampaignQueueProcessor, CampaignQueueService],
  exports: [CampaignQueueService],
})
export class CampaignQueueModule {} 