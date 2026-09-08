import { Enrollment } from "src/enrollment/entities/enrollment.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Subject {

    @PrimaryGeneratedColumn()
    id!:number;

    @Column({unique:true,
            nullable:false})
    name!:string;

    @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'teacherId' })
    teacher!: User | null;

    @OneToMany(()=>User,user=>user.subject)
    users!:User[];

    @OneToMany(() => Enrollment, enrollment => enrollment.subject)
    enrollments!: Enrollment[];
}
