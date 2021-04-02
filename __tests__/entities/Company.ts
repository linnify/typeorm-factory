import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Project} from "./Project";
import {Employee} from "./Employee";

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  numberOfEmployees: number;

  @Column({type: 'varchar'})
  description: string;

  @Column()
  website: string;

  @Column()
  active: boolean;

  @OneToMany(() => Project, (project) => project.company)
  projects: Project[];

  @OneToMany(() => Employee, (employee) => employee.company)
  employees: Employee[];
}
