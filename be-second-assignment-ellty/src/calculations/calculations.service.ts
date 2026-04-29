import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Calculation } from './schemas/calculation.schemas';

interface CreateCalculationDto {
  username: string;
  parentId?: string;
  operation: 'START' | 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE';
  rightArg: number;
}

@Injectable()
export class CalculationsService {
  constructor(
    @InjectModel(Calculation.name)
    private calculationModel: Model<Calculation>,
  ) {}

  performMath(
    leftValue: number,
    operation: string,
    rightValue: number,
  ): number {
    switch (operation) {
      case 'START':
        return rightValue;
      case 'ADD':
        return leftValue + rightValue;
      case 'SUBTRACT':
        return leftValue - rightValue;
      case 'MULTIPLY':
        return leftValue * rightValue;
      case 'DIVIDE':
        if (rightValue === 0)
          throw new BadRequestException('Cannot divide by zero');
        return leftValue / rightValue;
      default:
        return leftValue;
    }
  }

  async create(createDto: CreateCalculationDto) {
    let leftValue = 0;

    if (createDto.parentId) {
      if (!Types.ObjectId.isValid(createDto.parentId)) {
        throw new BadRequestException('Invalid Parent ID format');
      }

      const parent = await this.calculationModel
        .findById(createDto.parentId)
        .exec();
      if (!parent) throw new BadRequestException('Parent not found');

      leftValue = parent.value;
    }

    const finalValue = this.performMath(
      leftValue,
      createDto.operation,
      createDto.rightArg,
    );

    const newCalc = new this.calculationModel({
      ...createDto,
      value: finalValue,
    });

    return newCalc.save();
  }

  async findAll() {
    return this.calculationModel.find().sort({ createdAt: 1 }).exec();
  }
}
