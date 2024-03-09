import { ParamIdDto } from 'src/common/dto/param-id.dto';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { GetFavoritesQueryDto } from './dto/get-favorites-query.dto';
import { FavoriteService } from './favorite.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get('/')
  async getAll(@Query() queryParams: GetFavoritesQueryDto) {
    let { page, pageSize } = queryParams;

    page = page || 1;
    pageSize = pageSize || 10;

    return this.favoriteService.getAll(page, pageSize);
  }

  @Post('/')
  async add(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoriteService.add(createFavoriteDto);
  }

  @Delete('/:id')
  async remove(@Param() param: ParamIdDto) {
    return this.favoriteService.remove(param.id);
  }
}
