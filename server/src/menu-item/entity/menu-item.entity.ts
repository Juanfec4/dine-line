import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ItemCategory } from './item-category.entity';
import { Review } from 'src/review/entity/review.entity';

@Entity()
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @Column()
  isAvailable: boolean;

  @ManyToOne(() => ItemCategory, (itemCategory) => itemCategory.menuItems, {
    onDelete: 'CASCADE',
  })
  category: ItemCategory;

  @OneToMany(() => Review, (review) => review.menuItem)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
