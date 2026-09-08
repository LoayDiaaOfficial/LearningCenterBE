import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Grade {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Enrollment, (enrollment) => enrollment.grade, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'enrollmentId' })
  enrollment!: Enrollment;

  @Column()
  enrollmentId!: number;

  @Column('float')
  score!: number;

  @Column({ type: 'varchar', nullable: true })
  comment!: string | null;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'gradedById' })
  gradedBy!: User;
}
