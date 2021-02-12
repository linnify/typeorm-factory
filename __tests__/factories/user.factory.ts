import {User} from "../entities/User";
import {CompanyFactory} from "./company.factory";
import {Factory, SubFactory} from "../../src";

export class UserFactory extends Factory<User> {
  entity = User;

  firstName = 'Darius'
  lastName = 'Bogdan'
  email = 'darius.bogdan@linnify.com'
  company = new SubFactory(CompanyFactory)

  protected getOrCreate(): string[] {
    return ['email']
  }
}
