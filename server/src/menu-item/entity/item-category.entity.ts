import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MenuItem } from './menu-item.entity';

@Entity()
export class ItemCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  name: string;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.category)
  menuItems: MenuItem[];
}
