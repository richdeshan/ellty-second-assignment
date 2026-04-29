import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CalculationsController } from './calculations.controller';
import { CalculationsService } from './calculations.service';
import { CalculationSchema } from './schemas/calculation.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Calculation',
        schema: CalculationSchema,
      },
    ]),
  ],
  controllers: [CalculationsController],
  providers: [CalculationsService],
})
export class CalculationsModule {}
