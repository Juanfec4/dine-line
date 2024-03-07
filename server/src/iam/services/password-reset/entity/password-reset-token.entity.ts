import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity()
export class PasswordResetToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.passwordResetTokens, { cascade: true })
  user: User;

  @Column({ nullable: false, unique: true })
  tokenValue: string;

  @Column()
  expiryDate: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
