import { ApiProperty } from '@nestjs/swagger';

export class ListAllEntities {
  @ApiProperty({
    description: 'Limite le nombre de résultats retournés',
    example: 10,
    required: false,
    minimum: 1,
    maximum: 100,
    type: Number,
  })
  limit?: number;

  @ApiProperty({
    description: 'Décalage pour la pagination',
    example: 0,
    required: false,
    minimum: 0,
    type: Number,
  })
  offset?: number;
}
