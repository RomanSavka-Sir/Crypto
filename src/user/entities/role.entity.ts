import { Entity, OneToMany, PrimaryColumn } from "typeorm";
import { UserRole } from "./user.role.entity";

@Entity({
    name: 'roles'
})
export class Role {
    @PrimaryColumn()
    id: string;

    @OneToMany(() => UserRole, userRole => userRole.role)
    userRoles: UserRole[]
}