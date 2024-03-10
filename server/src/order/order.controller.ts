import { ParamIdDto } from 'src/common/dto/param-id.dto';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import { OrderService } from './order.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AdminRoute } from 'src/common/decorators/admin-route.decorator';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/')
  async getAll(@Query() queryParams: GetOrdersQueryDto) {
    const { page, pageSize } = queryParams;

    return await this.orderService.getAll(page, pageSize, false);
  }

  @Get('/:id')
  async getOne(@Param() param: ParamIdDto) {
    return await this.orderService.getOne(param.id, false);
  }

  @Post('/')
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(createOrderDto);
  }

  @Patch('/cancel-order/:id')
  async cancelOrder(
    @Param() param: ParamIdDto,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return await this.orderService.updateStatus(
      param.id,
      updateOrderStatusDto,
      false,
    );
  }

  @AdminRoute()
  @Get('/admin-view')
  async adminGetAll(@Query() queryParams: GetOrdersQueryDto) {
    const { page, pageSize } = queryParams;

    return await this.orderService.getAll(page, pageSize, true);
  }

  @AdminRoute()
  @Get('/admin-view/:id')
  async adminGetOne(@Param() param: ParamIdDto) {
    return await this.orderService.getOne(param.id, true);
  }

  @AdminRoute()
  @Patch('/update-status/:id')
  async updateStatus(
    @Param() param: ParamIdDto,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return await this.orderService.updateStatus(
      param.id,
      updateOrderStatusDto,
      true,
    );
  }

  @AdminRoute()
  @Patch('/:id')
  async update(
    @Param() param: ParamIdDto,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.orderService.updateOrder(param.id, updateOrderDto);
  }
}
