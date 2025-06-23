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
import { Cat as ICat } from './interfaces/cat.interface';
import { Cat } from './schemas/cat.schema';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { ApiOkResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';

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
  @ApiOkResponse({
    description: 'Liste des chats récupérée avec succès',
    type: [Cat],
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite le nombre de résultats retournés',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Décalage pour la pagination',
  })
  async findAll(@Query() query: ListAllEntities): Promise<ICat[]> {
    const cats = await this.catsService.findAll();
    const mappedCats: ICat[] = cats.map((cat) => {
      const typedCat = cat as Cat & { _id: { toString: () => string } };
      return {
        id: typedCat._id.toString(),
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
  @ApiOkResponse({
    description: 'Le chat a été mis à jour avec succès',
    type: Cat,
  })
  @ApiParam({
    name: 'id',
    description: 'ID du chat à mettre à jour',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({ type: UpdateCatDto })
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

    const updatedCat = await this.catsService.update(id, updateCatDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Chat mis à jour avec succès',
      data: updatedCat,
    };
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Le chat a été supprimé avec succès',
  })
  @ApiParam({
    name: 'id',
    description: 'ID du chat à supprimer',
    example: '507f1f77bcf86cd799439011',
  })
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

    const catDoc = existingCat as Cat & { _id?: { toString: () => string } };
    const catData = {
      id: catDoc._id ? catDoc._id.toString() : id,
      name: catDoc.name,
      age: catDoc.age,
      breed: catDoc.breed,
    };

    await this.catsService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Chat supprimé avec succès',
      data: catData,
    };
  }
}
