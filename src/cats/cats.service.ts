import { Injectable } from '@nestjs/common';
import { Cat } from './schemas/cat.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCatDto } from './dto';

@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name) private catModel: Model<Cat>) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }

  async findOne(id: string): Promise<Cat | null> {
    return this.catModel.findById(id).exec();
  }

  async update(id: string, cat: Cat): Promise<Cat | null> {
    return this.catModel.findByIdAndUpdate(id, cat, { new: true }).exec();
  }

  async remove(id: string): Promise<Cat | null> {
    return this.catModel.findByIdAndDelete(id).exec();
  }
}
