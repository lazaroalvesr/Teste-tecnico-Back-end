import { Test, TestingModule } from '@nestjs/testing';
import { ReadingController } from './reading.controller';
import { ReadingService } from './reading.service';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreateMeasurementDto, MeasureType } from '../DTO/measurment/reading.dto';

describe('ReadingController', () => {
  let controller: ReadingController;
  let service: ReadingService;

  const mockReadingService = {
    upload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadingController],
      providers: [
        {
          provide: ReadingService,
          useValue: mockReadingService,
        },
      ],
    }).compile();

    controller = module.get<ReadingController>(ReadingController);
    service = module.get<ReadingService>(ReadingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('upload', () => {
    it('should return result from ReadingService.upload', async () => {
      const createMeasurementDto: CreateMeasurementDto = {
        image_url: 'valid-base64',
        measure_datetime: new Date().toISOString(),
        measure_type: MeasureType.WATER,
        customerId: '123',
        measure_value: 0,
        measure_uuid: '',
        has_confirmed: false,
        confirmed_value: 0
      };

      const result = {
        image_url: 'http://localhost:3005/temp/some-uuid.jpg',
        measure_value: 100,
        measure_uuid: 'some-uuid',
      };

      mockReadingService.upload.mockResolvedValue(result);

      expect(await controller.upload(createMeasurementDto)).toEqual(result);
    });

    it('should throw BadRequestException if ReadingService.upload throws BadRequestException', async () => {
      const createMeasurementDto: CreateMeasurementDto = {
        image_url: 'invalid-base64',
        measure_datetime: new Date().toISOString(),
        measure_type: MeasureType.WATER,
        customerId: '123',
        measure_value: 0,
        measure_uuid: '',
        has_confirmed: false,
        confirmed_value: 0
      };

      mockReadingService.upload.mockRejectedValue(new BadRequestException('Invalid base64 image'));

      await expect(controller.upload(createMeasurementDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if ReadingService.upload throws ConflictException', async () => {
      const createMeasurementDto: CreateMeasurementDto = {
        image_url: 'valid-base64',
        measure_datetime: new Date().toISOString(),
        measure_type: MeasureType.WATER,
        customerId: '123',
        measure_value: 0,
        measure_uuid: '',
        has_confirmed: false,
        confirmed_value: 0
      };

      mockReadingService.upload.mockRejectedValue(new ConflictException({
        error_code: 'Double_report',
        "error_description": "Leitura do mês já realizada"
      }));

      await expect(controller.upload(createMeasurementDto)).rejects.toThrow(ConflictException);
    });
  });
});
