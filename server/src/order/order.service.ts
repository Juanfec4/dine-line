import { ConfigService } from '@nestjs/config';
import { StripeService } from './../stripe/stripe.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { MenuItemService } from './../menu-item/menu-item.service';
import { AddressService } from './../address/address.service';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  forwardRef,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entity/order-item.entity';
import { User } from 'src/iam/services/user/entity/user.entity';
import moment from 'moment';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from 'src/common/enums';
import { nanoid } from 'nanoid';

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @Inject(forwardRef(() => StripeService))
    private readonly stripeService: StripeService,
    private readonly addressService: AddressService,
    private readonly menuItemService: MenuItemService,
    private readonly configService: ConfigService,
  ) {}

  async getAll(page: number, pageSize: number, isAdmin: boolean) {
    const userId = this.request['userId'];
    const dummyUser: Partial<User> = { id: userId };

    let orders: Order[] | null = null;
    if (isAdmin) {
      orders = await this.orderRepository.find({
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
    } else {
      //Get orders
      orders = await this.orderRepository.find({
        where: { user: dummyUser },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
    }

    return orders;
  }

  async getOne(id: number, isAdmin: boolean) {
    const userId = this.request['userId'];
    const dummyUser: Partial<User> = { id: userId };

    let order: Order | null = null;

    if (isAdmin) {
      order = await this.orderRepository.findOne({
        where: { id },
        relations: { items: true, deliveryAddress: true },
      });
    } else {
      //Get order
      order = await this.orderRepository.findOne({
        where: { id, user: dummyUser },
        relations: { items: true, deliveryAddress: true },
      });
    }

    //No order
    if (!order) {
      throw new NotFoundException(`Order with id ${id} does not exist.`);
    }

    return order;
  }

  async create(createOrderDto: CreateOrderDto) {
    const userId = this.request['userId'];
    const dummyUser: Partial<User> = { id: userId };

    //Create item promise array
    const itemPromises = createOrderDto.orderItemIds.map(async (orderItem) => {
      const menuItem = await this.menuItemService.getOne(orderItem.itemId);

      const item = await this.orderItemRepository.create({
        menuItem: menuItem,
        quantity: orderItem.quantity,
        price: Number(orderItem.quantity) * Number(menuItem.price),
      });

      return item;
    });

    //Items
    const items = await Promise.all(itemPromises);

    //Calculate total price
    const totalPrice = items.reduce((acc, item) => acc + item.price, 0);

    //Get address
    const deliveryAddress = await this.addressService.getOne(
      createOrderDto.deliveryAddressId,
    );

    //Create stripe session
    const session = await this.stripeService.createCheckoutSession(
      items,
      'usd',
      `${this.configService.get<string>('frontEndUrl')}/success?session_id={CHECKOUT_SESSION_ID}`,
      `${this.configService.get<string>('frontEndUrl')}/cancel`,
    );

    //Create order
    const order = this.orderRepository.create({
      ...createOrderDto,
      user: dummyUser,
      items,
      totalPrice,
      orderDate: moment().toDate(),
      deliveryAddress,
      orderCode: nanoid(10),
      sessionId: session.id,
    });

    //Save Order
    await this.orderRepository.save(order);

    return { sessionId: session.id, url: session.url };
  }

  async updateStatus(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    isAdmin: boolean,
  ) {
    let updatedOrder: Order | null = null;

    if (!isAdmin) {
      updatedOrder = await this.getOne(id, false);
    } else {
      updatedOrder = await this.orderRepository.preload({
        id,
        ...updateOrderStatusDto,
      });
    }

    //Check if status is valid
    if (!isAdmin && updateOrderStatusDto.newStatus === OrderStatus.COMPLETED) {
      throw new ForbiddenException(
        'You are not authorized to perform this change.',
      );
    }

    //No order found
    if (!updatedOrder) {
      throw new NotFoundException(`Order with id ${id} not found.`);
    }

    //Save order
    await this.orderRepository.save(updatedOrder);
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    const updatedOrder = await this.orderRepository.preload({
      id,
      ...updateOrderDto,
    });

    //No order found
    if (!updatedOrder) {
      throw new NotFoundException(`Order with id ${id} not found.`);
    }
    //Save order
    await this.orderRepository.save(updatedOrder);
  }

  async getBySession(sessionId: string) {
    return await this.orderRepository.findOne({
      where: { sessionId },
      relations: {
        user: true,
        items: { menuItem: true },
        deliveryAddress: true,
      },
    });
  }
}
