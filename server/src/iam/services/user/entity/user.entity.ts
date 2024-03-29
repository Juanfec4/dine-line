import { VerificationToken } from './../../verification/entity/verification-token.entity';
import { UserStatus } from 'src/common/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PasswordResetToken } from '../../password-reset/entity/password-reset-token.entity';
import { Address } from 'src/address/entity/address.entity';
import { Review } from 'src/review/entity/review.entity';
import { Favorite } from 'src/favorite/entity/favorite.entity';
import { Order } from 'src/order/entity/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false, unique: true })
  lastName: string;

  @Index()
  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Index()
  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ enum: UserStatus })
  status: UserStatus;

  @OneToMany(
    () => PasswordResetToken,
    (passwordResetToken) => passwordResetToken.user,
  )
  passwordResetTokens: PasswordResetToken[];

  @OneToMany(
    () => VerificationToken,
    (verificationToken) => verificationToken.user,
  )
  verificationTokens: VerificationToken[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
