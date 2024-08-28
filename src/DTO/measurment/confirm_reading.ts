import { PartialType } from "@nestjs/mapped-types";
import { CreateMeasurementDto } from "./reading.dto";

export class UpdateReading extends PartialType(CreateMeasurementDto) { }
