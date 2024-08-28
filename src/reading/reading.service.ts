import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateMeasurementDto } from '../DTO/measurment/reading.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as crypto from 'crypto';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
config();

@Injectable()
export class ReadingService {
    private readonly genAI = new GoogleGenerativeAI(process.env.API_KEY);
    private readonly model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    private isBase64(str: string): boolean {
        try {
            return Buffer.from(str, 'base64').toString('base64') === str;
        } catch (err) {
            return false;
        }
    }
    private fileToGenerativePart(filePath: string, mimeType: string) {
        return {
            inlineData: {
                data: fs.readFileSync(filePath).toString('base64'),
                mimeType,
            },
        };
    }

    constructor(private readonly prismaService: PrismaService) { }

    async upload(items: CreateMeasurementDto) {
        if (!this.isBase64(items.image_url)) {
            throw new BadRequestException('Invalid base64 image');
        }

        const existingReading = await this.prismaService.reading.findFirst({
            where: {
                measure_datetime: {
                    gte: new Date(new Date(items.measure_datetime).getFullYear(), new Date(items.measure_datetime).getMonth(), 1),
                    lt: new Date(new Date(items.measure_datetime).getFullYear(), new Date(items.measure_datetime).getMonth() + 1, 1),
                },
                measure_type: items.measure_type,
            },
        });

        if (existingReading) {
            throw new ConflictException({
                error_code: 'Double_report',
                "error_description": "Leitura do mês já realizada"
            })
        }

        const tempDir = path.join(__dirname, '..', '..', 'temp');

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        const guid = crypto.randomUUID();
        const tempFilePath = path.join(tempDir, `${guid}.jpg`);
        fs.writeFileSync(tempFilePath, Buffer.from(items.image_url, 'base64'));

        try {
            const imagePart = this.fileToGenerativePart(tempFilePath, 'image/jpeg');
            const prompt = 'Me retorne somente a medição do registro';
            const result = await this.model.generateContent([prompt, imagePart]);

            const extractedValue = result.response.text();
            const number = parseFloat(extractedValue)
            const imageLink = `http://localhost:3005/temp/${guid}.jpg`;

            const reading = await this.prismaService.reading.create({
                data: {
                    image_url: imageLink,
                    measure_value: number,
                    measure_datetime: new Date(items.measure_datetime),
                    has_confirmed: false,
                    customerId: items.customerId,
                    measure_type: items.measure_type,
                },
            });

            const id = reading.id

            return {
                image_url: imageLink,
                measure_value: number,
                measure_uuid: id
            }
        } catch (error) {
            throw new BadRequestException({
                "error_code": "INVALID_DATA",
                "error_description": error
            });
        }
    }
}
