import { Address } from 'src/address/entity/address.entity';
import { OrderStatus, PaymentMethods } from 'src/common/enums';
import { User } from 'src/iam/services/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderDate: Date;

  @Index()
  @Column({ unique: true })
  orderCode: string;

  @Index()
  @Column()
  sessionId: string;

  @Column({ enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column()
  totalPrice: number;

  @Column({ enum: PaymentMethods })
  paymentMethod: PaymentMethods;

  @Column({ default: false })
  isPaid: boolean;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Address, (address) => address.id)
  deliveryAddress: Address;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
