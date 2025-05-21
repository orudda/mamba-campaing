import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { Campaign } from './domain/entities/campaign.entity';
import { CampaignService } from './application/services/campaign.service';
import { CampaignController } from './presentation/controllers/campaign.controller';
import { CampaignSchedulerService } from './application/services/campaign-scheduler.service';
import { CampaignQueueModule } from './application/queues/campaign.queue.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Campaign],
      synchronize: true,
      logging: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
    }),
    TypeOrmModule.forFeature([Campaign]),
    ScheduleModule.forRoot(),
    CampaignQueueModule,
  ],
  controllers: [CampaignController],
  providers: [CampaignService, CampaignSchedulerService],
})
export class AppModule {} 