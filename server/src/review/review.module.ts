import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entity/review.entity';
import { MenuItemModule } from 'src/menu-item/menu-item.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), MenuItemModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
