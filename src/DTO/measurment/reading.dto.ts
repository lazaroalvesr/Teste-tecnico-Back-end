import { IsBoolean, IsEnum, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export enum MeasureType {
    WATER = 'WATER',
    GAS = 'GAS',
}

export class CreateMeasurementDto {
    @IsNotEmpty()
    @IsString()
    image_url: string;

    @IsNotEmpty()
    @IsString()
    measure_value: number

    @IsString()
    measure_uuid: string

    @IsBoolean()
    has_confirmed: boolean

    @IsNumber()
    confirmed_value: number

    @IsNotEmpty()
    @IsString()
    customerId: string;

    @IsNotEmpty()
    @IsString()
    measure_datetime: string;

    @IsNotEmpty()
    @IsEnum(MeasureType)
    measure_type: MeasureType;
}
