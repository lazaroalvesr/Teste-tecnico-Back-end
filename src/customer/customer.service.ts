import {  BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'
import { CreateCustomerDTO, MeasureType } from 'src/DTO/customer/customer_create.dto';

@Injectable()
export class CustomerService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(items: CreateCustomerDTO) {
        return await this.prismaService.customer.create({
            data: {
                customer_code: items.customer_code
            }
        })
    }

    async findByCustomerCode(customerCode: string, measureType?: MeasureType) {
        if (measureType && measureType !== 'WATER' && measureType !== 'GAS') {
            throw new BadRequestException({
                error_code: "INVALID_TYPE",
                error_description: "Tipo de medição não permitida"
            });
        }

        const res = await this.prismaService.customer.findFirst({
            where: { customer_code: customerCode },
            include: {
                Reading: {
                    where: { measure_type: measureType }
                }
            }
        })

        if (res.Reading.length === 0) {
            throw new NotFoundException(
                {
                    "error_code": "MEASURES_NOT_FOUND",
                    "error_description": "Nenhuma leitura encontrada"
                }
            )
        }
    }
}
