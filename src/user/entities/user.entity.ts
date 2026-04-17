import { Subject } from "src/subject/entities/subject.entity";
import { UserType } from "src/user-type/entities/user-type.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!:string;

    @Column()
    password!:string;

    @ManyToOne(()=>Subject,subject=>subject.users,{
        eager:true,
        nullable:true,
        onDelete:'RESTRICT'
    })
    subject!:Subject;

    @ManyToOne(()=>UserType, userType => userType.type,{
        eager :true,
        nullable:false,
        onDelete:'RESTRICT'
    })
    userType!:UserType;
}
