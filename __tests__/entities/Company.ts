import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Project} from "./Project";

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

  @OneToMany(() => Project, (project) => project.company)
  projects: Project[];
}
