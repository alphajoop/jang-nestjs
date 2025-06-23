import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
  @Prop({ required: true })
  @ApiProperty({
    description: 'Le nom du chat',
    example: 'Félix',
    required: true,
  })
  name: string;

  @Prop({ required: true })
  @ApiProperty({
    description: "L'âge du chat en années",
    example: 3,
    required: true,
  })
  age: number;

  @Prop({ required: true })
  @ApiProperty({
    description: 'La race du chat',
    example: 'Siamois',
    required: true,
  })
  breed: string;

  //@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
  // This ensures the field is not confused with a populated reference
  // owner: mongoose.Types.ObjectId;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
