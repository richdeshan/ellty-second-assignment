export type OperationType =
  | "START"
  | "ADD"
  | "SUBTRACT"
  | "MULTIPLY"
  | "DIVIDE";

export interface Calculation {
  _id: string;
  username: string;
  parentId: string | null;
  operation: OperationType;
  rightArg: number;
  value: number;
  createdAt: string;
  updatedAt: string;
  children?: Calculation[];
}

export interface CreateCalculationPayload {
  username: string;
  parentId?: string;
  operation: OperationType;
  rightArg: number;
}
