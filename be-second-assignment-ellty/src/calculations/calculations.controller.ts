import { Controller, Get, Post, Body } from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('calculations')
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Get()
  async getAll() {
    return await this.calculationsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new math tree node' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'johndoe' },
        parentId: { type: 'string', example: '645f1...', nullable: true },
        operation: {
          type: 'string',
          enum: ['START', 'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE'],
          example: 'ADD',
        },
        rightArg: { type: 'number', example: 10 },
      },
      required: ['username', 'operation', 'rightArg'],
    },
  })
  async create(@Body() createDto: any) {
    return await this.calculationsService.create(createDto);
  }
}
