import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateReading } from '../DTO/measurment/confirm_reading';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConfirmService {
    constructor(private prismaService: PrismaService) { }

    async confirm(items: UpdateReading) {
        if (!items || !items.measure_uuid || items.confirmed_value === undefined) {
            throw new BadRequestException({
                "error_code": "INVALID_DATA",
                "error_description": "Os dados fornecidos no corpo da requisição são inválidos"
            }
            );
        }

        const reading = await this.prismaService.reading.findFirst({
            where: { measure_uuid: items.measure_uuid }
        });

        if (!reading) {
            throw new NotFoundException({
                "error_code":
                    "MEASURE_NOT_FOUND",
                "error_description": "Leitura do mês já realizada"
            });
        }

        if (reading.has_confirmed) {
            throw new ConflictException({
                error_code: 'MEASURE_ALREADY_CONFIRMED',
                "error_description": "Leitura do mês já realizada"
            });
        }

        await this.prismaService.reading.update({
            where: { measure_uuid: items.measure_uuid },
            data: { has_confirmed: true, measure_value: items.measure_value }
        });

        return { success: true };
    }
}
