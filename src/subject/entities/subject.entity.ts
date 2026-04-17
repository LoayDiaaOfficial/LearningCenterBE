import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Subject {

    @PrimaryGeneratedColumn()
    id!:number;

    @Column({unique:true,
            nullable:false})
    name!:string;

    @OneToMany(()=>User,user=>user.subject)
    users!:User[];

}
