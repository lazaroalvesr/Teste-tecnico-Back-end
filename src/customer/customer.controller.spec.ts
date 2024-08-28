import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from '../customer/customer.controller';
import { CustomerService } from '../customer/customer.service';
import { CreateCustomerDTO } from 'src/DTO/customer/customer_create.dto';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService

  const mockCustomerService = {
    create: jest.fn((dto: CreateCustomerDTO) => {
      return { customer_code: '5477', ...dto };
    }),
    findByCustomerCode: jest.fn((customerCode: string, measureType: string) => {
      if (measureType) {
        return { customerCode, measureType };
      } else {
        return { customerCode };
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });


  it('should create a customer', async () => {
    const dto: CreateCustomerDTO = {
      customer_code: '5477'
    }

    const result = await controller.create(dto)

    expect(result).toEqual({ customer_code: '5477' })
  });

  it('should find customer by customerCode with measureType', async () => {
    const customerCode = '5477'
    const measureType = 'WATER'


    const result = await controller.findByCustomer(customerCode, measureType)

    expect(result).toEqual({ customerCode, measureType })
  });
});
