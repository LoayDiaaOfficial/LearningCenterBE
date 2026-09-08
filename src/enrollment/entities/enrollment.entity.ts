import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Subject } from 'src/subject/entities/subject.entity';
import { Grade } from 'src/grade/entities/grade.entity';

@Entity()
@Unique(['studentId', 'subjectId'])
export class Enrollment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student!: User;

  @Column()
  studentId!: number;

  @ManyToOne(() => Subject, (subject) => subject.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subjectId' })
  subject!: Subject;

  @Column()
  subjectId!: number;

  @CreateDateColumn()
  enrolledAt!: Date;

  @OneToOne(() => Grade, (grade) => grade.enrollment)
  grade?: Grade;
}
