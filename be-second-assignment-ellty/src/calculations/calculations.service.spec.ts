import { Test, TestingModule } from '@nestjs/testing';
import { CalculationsService } from './calculations.service';
import { getModelToken } from '@nestjs/mongoose';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';

interface TestableCalculationsService {
  performMath(left: number, op: string, right: number): number;
}

describe('CalculationsService', () => {
  let service: CalculationsService;
  let testableService: TestableCalculationsService;

  const mockCalculationModel = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    exec: jest.fn(),
    save: jest.fn(),
  } as unknown;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalculationsService,
        {
          provide: getModelToken('Calculation'),
          useValue: mockCalculationModel,
        },
      ],
    }).compile();

    service = module.get<CalculationsService>(CalculationsService);
    testableService = service;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('performMath', () => {
    it('should add numbers correctly', () => {
      const result = testableService.performMath(10, 'ADD', 5);
      expect(result).toBe(15);
    });

    it('should subtract numbers correctly', () => {
      const result = testableService.performMath(10, 'SUBTRACT', 4);
      expect(result).toBe(6);
    });

    it('should multiply numbers correctly', () => {
      const result = testableService.performMath(3, 'MULTIPLY', 4);
      expect(result).toBe(12);
    });

    it('should handle division and prevent division by zero', () => {
      const result = testableService.performMath(10, 'DIVIDE', 2);
      expect(result).toBe(5);

      expect(() => {
        testableService.performMath(10, 'DIVIDE', 0);
      }).toThrow(BadRequestException);
    });

    it('should return rightArg for START operation', () => {
      const result = testableService.performMath(0, 'START', 100);
      expect(result).toBe(100);
    });
  });
});
