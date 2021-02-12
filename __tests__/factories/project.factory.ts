import {Project} from "../entities/Project";
import {CompanyFactory} from "./company.factory";
import {Factory, Sequence, SubFactory} from "../../src";

export class ProjectFactory extends Factory<Project> {
  entity = Project

  name = 'TypeORM Factory';
  price = new Sequence((i) => i * 1000);
  startDate = new Date();
  company = new SubFactory(CompanyFactory)
}
