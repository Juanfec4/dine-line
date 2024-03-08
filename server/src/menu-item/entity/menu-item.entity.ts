import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItemCategory } from './item-category.entity';

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
}
