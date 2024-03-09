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
import { ParamIdDto } from 'src/common/dto/param-id.dto';

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
  async getOne(@Param() param: ParamIdDto) {
    return await this.reviewService.getOne(param.id);
  }

  @Post('/')
  async create(@Body() createReviewDto: CreateReviewDto) {
    return await this.reviewService.create(createReviewDto);
  }

  @Patch('/:id')
  async update(
    @Param() param: ParamIdDto,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return await this.reviewService.update(param.id, updateReviewDto);
  }

  @Delete('/:id')
  async delete(@Param() param: ParamIdDto) {
    return await this.reviewService.delete(param.id);
  }
}
