import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDTO, MeasureType } from '../DTO/customer/customer_create.dto';

@Controller('customer')
export class CustomerController {
    constructor(private customerService: CustomerService) { }

    @Post("/create")
    create(@Body() items: CreateCustomerDTO) {
        return this.customerService.create(items)
    }

    @Get(':customerCode')
    findByCustomer(@Param("customerCode") customerCode: string,
        @Query('measure_type') measureType?: MeasureType
    ) {
        return this.customerService.findByCustomerCode(customerCode , measureType)
    }
}
