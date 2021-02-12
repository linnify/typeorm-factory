import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Company} from "./Company";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({type: 'date'})
  startDate: Date;

  @ManyToOne(() => Company)
  @JoinColumn()
  company: Company;
}
