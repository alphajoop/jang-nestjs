import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateCatDto, UpdateCatDto, ListAllEntities } from './dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    const createdCat = await this.catsService.create(createCatDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Chat ajouté avec succès',
      data: createdCat,
    };
  }

  @Get()
  async findAll(@Query() query: ListAllEntities): Promise<Cat[]> {
    const cats = await this.catsService.findAll();
    const mappedCats: Cat[] = cats.map((cat) => {
      const typedCat = cat as Cat & { _id?: { toString?: () => string } };
      return {
        id: typedCat._id?.toString?.() ?? typedCat.id,
        name: typedCat.name,
        age: typedCat.age,
        breed: typedCat.breed,
      };
    });
    if (query.limit && query.offset) {
      return mappedCats.slice(query.offset, query.offset + query.limit);
    } else {
      return mappedCats;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const cat = await this.catsService.findOne(id);
    if (!cat) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: `Aucun chat trouvé avec l'ID ${id}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Chat récupéré avec succès',
      data: cat,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateCatDto: UpdateCatDto,
  ) {
    const existingCat = await this.catsService.findOne(id);
    if (!existingCat) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: `Aucun chat trouvé avec l'ID ${id}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const updatedCat: Cat = {
      ...existingCat,
      ...updateCatDto,
      id,
    };
    await this.catsService.update(id, updatedCat);
    return {
      statusCode: HttpStatus.OK,
      message: 'Chat mis à jour avec succès',
      data: updatedCat,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    const existingCat = await this.catsService.findOne(id);
    if (!existingCat) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: `Aucun chat trouvé avec l'ID ${id}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.catsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Chat supprimé avec succès',
      data: existingCat,
    };
  }
}
