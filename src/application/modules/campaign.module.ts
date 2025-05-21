import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from '../../domain/entities/campaign.entity';
import { CampaignService } from '../services/campaign.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign]),
  ],
  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule {} 