import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Calculation extends Document {
  @Prop({ required: true })
  username!: string;

  @Prop({ type: Types.ObjectId, ref: 'Calculation', default: null })
  parentId!: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['START', 'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE'],
  })
  operation!: string;

  @Prop({ required: true })
  rightArg!: number;

  @Prop({ required: true })
  value!: number;
}

export const CalculationSchema = SchemaFactory.createForClass(Calculation);
