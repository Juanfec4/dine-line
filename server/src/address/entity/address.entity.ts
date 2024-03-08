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
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  alias: string;

  @Column({ default: false })
  isPrimary: boolean;

  @Column({ nullable: false })
  unit: string;

  @Column({ nullable: false })
  addressLine1: string;

  @Column({ nullable: true })
  addressLine2: string;

  @Column({ nullable: false })
  city: string;

  @Column({ nullable: false })
  province: string;

  @Column({ nullable: false })
  country: string;

  @Column({ nullable: false })
  postalCode: string;

  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
