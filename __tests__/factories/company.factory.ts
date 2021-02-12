import {Company} from "../entities/Company";
import {Factory} from "../../src";
import {PostGeneration} from "../../src/decorators";

const myFunction = () => {
  console.log(new Date());
}

export class CompanyFactory extends Factory<Company> {
  entity = Company;

  name = 'Linnify'
  numberOfEmployees = 40
  description = 'Simplifying life through innovation'
  website = 'https://linnify.com'

  @PostGeneration()
  createLog() {
    console.log('Company created!');
  }

  @PostGeneration()
  callAFunction() {
    myFunction();
  }
}
