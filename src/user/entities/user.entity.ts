import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 50, default: 'reader' })
  role: string;

  @Column({ default: 0 })
  score: number;

  @Column({ type: 'timestamp', nullable: true })
  last_claim_data: Date;

  @CreateDateColumn()
  created_at: Date;
}
