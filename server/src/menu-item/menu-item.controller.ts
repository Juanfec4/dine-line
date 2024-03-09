import { MenuItemService } from './menu-item.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { AdminRoute } from 'src/common/decorators/admin-route.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { Request } from 'express';
import { GetMenuItemsQueryDto } from './dto/get-menu-items-query.dto';
import { ParamIdDto } from 'src/common/dto/param-id.dto';

@Controller('menu-item')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Public()
  @Get('/')
  async getAll(@Query() queryParams: GetMenuItemsQueryDto) {
    let { page, pageSize, categoryId } = queryParams;

    page = page || 1;
    pageSize = pageSize || 10;

    return await this.menuItemService.getAll(page, pageSize, categoryId);
  }

  @Public()
  @Get('/categories')
  async getCategories() {
    return await this.menuItemService.getCategories();
  }

  @Public()
  @Get('/:id')
  async getOne(@Param() param: ParamIdDto) {
    return await this.menuItemService.getOne(param.id);
  }

  @AdminRoute()
  @Post('/')
  async create(
    @Req() req: Request,
    @Body() createMenuItemDto: CreateMenuItemDto,
  ) {
    const baseUrl = `${req.protocol}://${req.get('Host')}/media`;
    return await this.menuItemService.create(baseUrl, createMenuItemDto);
  }

  @AdminRoute()
  @Patch('/:id')
  async update(
    @Req() req: Request,
    @Param() param: ParamIdDto,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    const baseUrl = `${req.protocol}://${req.get('Host')}/media`;
    return await this.menuItemService.update(
      param.id,
      baseUrl,
      updateMenuItemDto,
    );
  }

  @AdminRoute()
  @Delete('/:id')
  async delete(@Param() param: ParamIdDto) {
    return await this.menuItemService.delete(param.id);
  }
}
