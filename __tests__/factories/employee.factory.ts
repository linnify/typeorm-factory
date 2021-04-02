import {Employee} from "../entities/Employee";
import {Factory, SubFactory} from "../../src";
import {CompanyFactory} from "./company.factory";

export class EmployeeFactory extends Factory<Employee> {
  entity = Employee;

  firstName = 'Darius'
  lastName = 'Bogdan'
  company = new SubFactory(CompanyFactory)
}
