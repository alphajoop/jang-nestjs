import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCatDto } from './create-cat.dto';

export class UpdateCatDto extends PartialType(CreateCatDto) {
  @ApiProperty({
    description: 'Le nom du chat',
    example: 'Félix',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: "L'âge du chat en années",
    example: 4,
    minimum: 0,
    maximum: 30,
    required: false,
  })
  age?: number;

  @ApiProperty({
    description: 'La race du chat',
    example: 'Siamois',
    required: false,
  })
  breed?: string;
}
