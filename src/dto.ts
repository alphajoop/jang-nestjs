export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}

export class UpdateCatDto {
  name?: string;
  age?: number;
  breed?: string;
}

export interface ListAllEntities {
  limit?: number;
  offset?: number;
}
