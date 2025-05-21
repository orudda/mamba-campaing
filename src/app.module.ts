import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Campaign } from './domain/entities/campaign.entity';
import { CampaignService } from './application/services/campaign.service';
import { CampaignController } from './presentation/controllers/campaign.controller';
import { CampaignSchedulerService } from './application/services/campaign-scheduler.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Campaign],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Campaign]),
    ScheduleModule.forRoot(),
  ],
  controllers: [CampaignController],
  providers: [CampaignService, CampaignSchedulerService],
})
export class AppModule {} 