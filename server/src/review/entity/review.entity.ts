import { MenuItem } from './../../menu-item/entity/menu-item.entity';
import { User } from 'src/iam/services/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  rating: number;

  @Column({ nullable: false })
  comment: string;

  @Column({ nullable: false })
  reviewDate: Date;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.reviews, {
    onDelete: 'CASCADE',
  })
  menuItem: MenuItem;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
