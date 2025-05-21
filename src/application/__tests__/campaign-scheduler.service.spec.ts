import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampaignSchedulerService } from '../services/campaign-scheduler.service';
import { Campaign, CampaignStatus, CampaignCategory } from '../../domain/entities/campaign.entity';
import { CampaignService } from '../services/campaign.service';

describe('CampaignSchedulerService', () => {
  let service: CampaignSchedulerService;
  let campaignService: CampaignService;
  let repository: Repository<Campaign>;

  const mockRepository = {
    find: jest.fn(),
    save: jest.fn(),
  };

  const mockCampaignService = {
    updateExpiredCampaigns: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignSchedulerService,
        {
          provide: getRepositoryToken(Campaign),
          useValue: mockRepository,
        },
        {
          provide: CampaignService,
          useValue: mockCampaignService,
        },
      ],
    }).compile();

    service = module.get<CampaignSchedulerService>(CampaignSchedulerService);
    campaignService = module.get<CampaignService>(CampaignService);
    repository = module.get<Repository<Campaign>>(getRepositoryToken(Campaign));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleExpiredCampaigns', () => {
    it('should find and update expired campaigns', async () => {
      const now = new Date();
      const expiredCampaign = {
        id: '1',
        nome: 'Expired Campaign',
        dataInicio: new Date(now.getTime() - 120000), // 2 minutes ago
        dataFim: new Date(now.getTime() - 60000),     // 1 minute ago
        status: CampaignStatus.ACTIVE,
        categoria: CampaignCategory.MARKETING,
      };

      const campaigns = [expiredCampaign];
      
      mockRepository.find.mockResolvedValue(campaigns);
      mockCampaignService.updateExpiredCampaigns.mockResolvedValue([
        { ...expiredCampaign, status: CampaignStatus.EXPIRED }
      ]);

      await service.handleExpiredCampaigns();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          dataFim: expect.any(Object),
          status: CampaignStatus.ACTIVE
        }
      });
      expect(mockCampaignService.updateExpiredCampaigns).toHaveBeenCalledWith(campaigns);
    });

    it('should handle case when no expired campaigns are found', async () => {
      mockRepository.find.mockResolvedValue([]);
      mockCampaignService.updateExpiredCampaigns.mockResolvedValue([]);

      await service.handleExpiredCampaigns();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(mockCampaignService.updateExpiredCampaigns).toHaveBeenCalledWith([]);
    });

    it('should update multiple expired campaigns', async () => {
      const now = new Date();
      const expiredCampaigns = [
        {
          id: '1',
          nome: 'Expired Campaign 1',
          dataInicio: new Date(now.getTime() - 180000), // 3 minutes ago
          dataFim: new Date(now.getTime() - 120000),    // 2 minutes ago
          status: CampaignStatus.ACTIVE,
          categoria: CampaignCategory.MARKETING,
        },
        {
          id: '2',
          nome: 'Expired Campaign 2',
          dataInicio: new Date(now.getTime() - 120000), // 2 minutes ago
          dataFim: new Date(now.getTime() - 60000),     // 1 minute ago
          status: CampaignStatus.ACTIVE,
          categoria: CampaignCategory.SALES,
        }
      ];

      mockRepository.find.mockResolvedValue(expiredCampaigns);
      mockCampaignService.updateExpiredCampaigns.mockResolvedValue(
        expiredCampaigns.map(campaign => ({ ...campaign, status: CampaignStatus.EXPIRED }))
      );

      await service.handleExpiredCampaigns();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(mockCampaignService.updateExpiredCampaigns).toHaveBeenCalledWith(expiredCampaigns);
    });
  });
}); 