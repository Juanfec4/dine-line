import { Favorite } from 'src/favorite/entity/favorite.entity';
import { MenuItemService } from './../menu-item/menu-item.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User } from 'src/iam/services/user/entity/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class FavoriteService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    private readonly menuItemService: MenuItemService,
  ) {}

  async add(createFavoriteDto: CreateFavoriteDto) {
    const userId = this.request['userId'];
    const dummyUser: Partial<User> = { id: userId };

    //Get menu item
    const menuItem = await this.menuItemService.getOne(
      createFavoriteDto.menuItemId,
    );

    //Favorite
    const favorite = await this.favoriteRepository.create({
      user: dummyUser,
      menuItem,
    });

    await this.favoriteRepository.save(favorite);
  }

  async remove(id: number) {
    const userId = this.request['userId'];
    const dummyUser: Partial<User> = { id: userId };

    //Get Favorite
    const favorite = await this.favoriteRepository.findOne({
      where: { user: dummyUser, id },
    });

    //Check if exists
    if (!favorite) {
      throw new NotFoundException(`Favorite with id ${id} does not exist.`);
    }

    //Delete
    await this.favoriteRepository.delete(favorite.id);
  }

  async getAll(page: number, pageSize: number) {
    const userId = this.request['userId'];
    const dummyUser: Partial<User> = { id: userId };

    //Get All
    const favorites = await this.favoriteRepository.find({
      where: { user: dummyUser },
      relations: { menuItem: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return favorites;
  }
}
