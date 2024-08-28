import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmController } from './confirm.controller';
import { ConfirmService } from './confirm.service';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateReading } from 'src/DTO/measurment/confirm_reading';

describe('ConfirmController', () => {
  let controller: ConfirmController;
  let service: ConfirmService;

  const mockConfirmService = {
    confirm: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfirmController],
      providers: [
        {
          provide: ConfirmService,
          useValue: mockConfirmService,
        },
      ],
    }).compile();

    controller = module.get<ConfirmController>(ConfirmController);
    service = module.get<ConfirmService>(ConfirmService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call confirm service and return success', async () => {
    const confirmDto: UpdateReading = { measure_uuid: 'uuid', confirmed_value: 123 };
    jest.spyOn(service, 'confirm').mockResolvedValue({ success: true });

    const result = await controller.confirm(confirmDto);
    expect(result).toEqual({ success: true });
    expect(service.confirm).toHaveBeenCalledWith(confirmDto);
  });

  it('should handle BadRequestException from service', async () => {
    const confirmDto: UpdateReading = { measure_uuid: 'uuid', confirmed_value: 123 };
    jest.spyOn(service, 'confirm').mockRejectedValue(new BadRequestException());

    await expect(controller.confirm(confirmDto)).rejects.toThrow(BadRequestException);
  });

  it('should handle NotFoundException from service', async () => {
    const confirmDto: UpdateReading = { measure_uuid: 'uuid', confirmed_value: 123 };
    jest.spyOn(service, 'confirm').mockRejectedValue(new NotFoundException());

    await expect(controller.confirm(confirmDto)).rejects.toThrow(NotFoundException);
  });

  it('should handle ConflictException from service', async () => {
    const confirmDto: UpdateReading = { measure_uuid: 'uuid', confirmed_value: 123 };
    jest.spyOn(service, 'confirm').mockRejectedValue(new ConflictException());

    await expect(controller.confirm(confirmDto)).rejects.toThrow(ConflictException);
  });
});
