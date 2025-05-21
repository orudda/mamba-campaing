import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './domain/entities/campaign.entity';
import { CampaignService } from './application/services/campaign.service';
import { CampaignController } from './presentation/controllers/campaign.controller';

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
  ],
  controllers: [CampaignController],
  providers: [CampaignService],
})
export class AppModule {} 