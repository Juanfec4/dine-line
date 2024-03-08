import { CreateReviewDto } from './dto/create-review.dto';
import { GetReviewsQueryDto } from './dto/get-reviews-query.dto';
import { ReviewFilterType } from 'src/common/enums';
import { ReviewService } from './review.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Public()
  @Get('/')
  async getAll(@Query() queryParams: GetReviewsQueryDto) {
    let { page, pageSize, type, searchId } = queryParams;

    page = page || 1;
    pageSize = pageSize || 10;
    type = type || ReviewFilterType.ANY;

    return await this.reviewService.getAll(page, pageSize, type, searchId);
  }

  @Public()
  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return await this.reviewService.getOne(id);
  }

  @Post('/')
  async create(@Body() createReviewDto: CreateReviewDto) {
    return await this.reviewService.create(createReviewDto);
  }

  @Patch('/:id')
  async update(
    @Param('id') id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return await this.reviewService.update(id, updateReviewDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.reviewService.delete(id);
  }
}
