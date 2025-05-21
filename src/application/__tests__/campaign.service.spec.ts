import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampaignService } from '../services/campaign.service';
import { Campaign, CampaignStatus, CampaignCategory } from '../../domain/entities/campaign.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CampaignService', () => {
  let service: CampaignService;
  let repository: Repository<Campaign>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignService,
        {
          provide: getRepositoryToken(Campaign),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CampaignService>(CampaignService);
    repository = module.get<Repository<Campaign>>(getRepositoryToken(Campaign));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a campaign successfully', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

      const createDto = {
        nome: 'Test Campaign',
        dataInicio: tomorrow,
        dataFim: dayAfterTomorrow,
        status: CampaignStatus.ACTIVE,
        categoria: CampaignCategory.MARKETING,
      };

      const campaign = { ...createDto, id: '1' };
      mockRepository.create.mockReturnValue(campaign);
      mockRepository.save.mockResolvedValue(campaign);

      const result = await service.create(createDto);
      expect(result).toEqual(campaign);
    });

    it('should throw BadRequestException if dataInicio is in the past', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const createDto = {
        nome: 'Test Campaign',
        dataInicio: yesterday,
        dataFim: tomorrow,
        status: CampaignStatus.ACTIVE,
        categoria: CampaignCategory.MARKETING,
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of campaigns', async () => {
      const campaigns = [
        {
          id: '1',
          nome: 'Campaign 1',
          dataInicio: new Date(),
          dataFim: new Date(),
          status: CampaignStatus.ACTIVE,
          categoria: CampaignCategory.MARKETING,
        },
      ];

      mockRepository.find.mockResolvedValue(campaigns);
      const result = await service.findAll();
      expect(result).toEqual(campaigns);
    });
  });

  describe('findOne', () => {
    it('should return a campaign by id', async () => {
      const campaign = {
        id: '1',
        nome: 'Campaign 1',
        dataInicio: new Date(),
        dataFim: new Date(),
        status: CampaignStatus.ACTIVE,
        categoria: CampaignCategory.MARKETING,
      };

      mockRepository.findOne.mockResolvedValue(campaign);
      const result = await service.findOne('1');
      expect(result).toEqual(campaign);
    });

    it('should throw NotFoundException if campaign not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
}); 