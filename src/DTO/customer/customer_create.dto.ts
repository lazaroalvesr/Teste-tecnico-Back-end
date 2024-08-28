import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerDTO {
    @IsNotEmpty()
    @IsString()
    customer_code: string;
}


export type MeasureType = 'WATER' | 'GAS';