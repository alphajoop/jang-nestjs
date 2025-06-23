import { ApiProperty } from '@nestjs/swagger';

export class CreateCatDto {
  @ApiProperty({
    description: 'Le nom du chat',
    example: 'Félix',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: "L'âge du chat en années",
    example: 3,
    minimum: 0,
    maximum: 30,
    required: true,
  })
  age: number;

  @ApiProperty({
    description: 'La race du chat',
    example: 'Persan',
    required: true,
  })
  breed: string;
}
