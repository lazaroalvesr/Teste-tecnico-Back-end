import { Body, Controller, Patch } from '@nestjs/common';
import { ConfirmService } from './confirm.service';
import { UpdateReading } from '../DTO/measurment/confirm_reading';

@Controller('confirm')
export class ConfirmController {
    constructor(private readonly confirmService: ConfirmService) { }

    @Patch()
    confirm(@Body() items: UpdateReading) {
        return this.confirmService.confirm(items)
    }
}
