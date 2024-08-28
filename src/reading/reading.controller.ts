import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateMeasurementDto } from '../DTO/measurment/reading.dto';
import { ReadingService } from './reading.service';

@Controller('readings')
export class ReadingController {
    constructor(private readonly readingService: ReadingService) { }

    @Post('upload')
    @HttpCode(200)
    async upload(@Body() createMeasurementDto: CreateMeasurementDto) {
        return this.readingService.upload(createMeasurementDto);
    }
}
