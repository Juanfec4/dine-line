import { UpdateReviewDto } from './dto/update-review.dto';
import { MenuItemService } from './../menu-item/menu-item.service';
import { CreateReviewDto } from './dto/create-review.dto';
import {
  ForbiddenException,
  Inject,
  Injectable,
  Scope,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entity/review.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User } from 'src/iam/services/user/entity/user.entity';
import { ReviewFilterType } from 'src/common/enums';

@Injectable({ scope: Scope.REQUEST })
export class ReviewService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly menuItemService: MenuItemService,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const userId = this.request['userId'];
    const dummyUser: Partial<User> = { id: userId };

    //Get menu item
    const menuItem = await this.menuItemService.getOne(
      createReviewDto.menuItemId,
    );

    //Create review
    const review = await this.reviewRepository.create({
      ...createReviewDto,
      user: dummyUser,
      menuItem,
    });

    //Save review
    await this.reviewRepository.save(review);
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const userId = this.request['userId'];

    //Get existing review
    const existingReview = await this.getOne(userId);

    //User is not the author
    if (existingReview.user.id !== userId) {
      throw new ForbiddenException('You are not the author of this review.');
    }

    //Create updated review
    const updatedReview = await this.reviewRepository.preload({
      id,
      ...updateReviewDto,
    });

    //Save updated review
    await this.reviewRepository.save(updatedReview);
  }

  async getAll(
    page: number,
    pageSize: number,
    type: ReviewFilterType,
    searchId?: number,
  ) {
    //Get all by menu item
    if (type === ReviewFilterType.MENU_ITEM && searchId) {
      return await this.getAllByMenuItem(searchId, page, pageSize);
    }

    //Get all by user
    if (type === ReviewFilterType.USER) {
      //SearchId will be either a specified user id or the current user
      const userId = searchId || this.request['userId'];
      return await this.getAllByUser(userId, page, pageSize);
    }

    //No filter
    return await this.reviewRepository.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async getOne(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    //No review throw error
    if (!review) {
      throw new NotFoundException(`Review with id ${id} does not exist.`);
    }

    return review;
  }

  async delete(id: number) {
    const userId = this.request['userId'];

    //Get existing review
    const review = await this.getOne(id);

    //User is not the author
    if (review.user.id !== userId) {
      throw new ForbiddenException('You are not the author of this review.');
    }

    //Delete review
    await this.reviewRepository.delete(review.id);
  }

  private async getAllByUser(userId: number, page: number, pageSize: number) {
    await this.reviewRepository.find({
      where: { user: { id: userId } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  private async getAllByMenuItem(
    menuItemId: number,
    page: number,
    pageSize: number,
  ) {
    await this.reviewRepository.find({
      where: { user: { id: menuItemId } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }
}
