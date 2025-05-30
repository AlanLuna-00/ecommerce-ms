import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from '../../shared/types/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: UserRole.USER })
  role: UserRole;
}
