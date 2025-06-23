import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  breed: string;

  //@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
  // This ensures the field is not confused with a populated reference
  // owner: mongoose.Types.ObjectId;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
