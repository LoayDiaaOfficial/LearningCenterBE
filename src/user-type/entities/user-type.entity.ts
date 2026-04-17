import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserType {

    @PrimaryGeneratedColumn()
    id!:number;

    @Column({unique:true})
    type!:string;

    @OneToMany(()=>User , user => user.userType)
    users!: User[];
}
