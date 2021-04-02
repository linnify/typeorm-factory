import {Company} from "../entities/Company";
import {Factory} from "../../src";
import {PostGeneration} from "../../src/decorators";
import {EmployeeFactory} from "./employee.factory";

const myFunction = () => {
  console.log(new Date());
}

export class CompanyFactory extends Factory<Company> {
  entity = Company;

  name = 'Linnify'
  numberOfEmployees = 40
  description = 'Simplifying life through innovation'
  website = 'https://linnify.com'
  active = true;

  @PostGeneration()
  async createLog(company: Company) {
    company.employees = await new EmployeeFactory().createMany(5, {company});
  }

  @PostGeneration()
  callAFunction() {
    myFunction();
  }
}
