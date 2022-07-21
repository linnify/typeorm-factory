import {Company} from "./entities/Company";
import {CompanyFactory} from "./factories/company.factory";
import {getRepository} from "typeorm";
import {Project} from "./entities/Project";
import {ProjectFactory} from "./factories/project.factory";
import {UserFactory} from "./factories/user.factory";
import {User} from "./entities/User";
import sinon from 'sinon';
import {FactoryStorage} from "../src";

describe('Test factories',() => {

    it('Should create new entity with default values when no attributes specified', async () => {
      const company: Company = await new CompanyFactory().create();

      expect(company.id).not.toBeUndefined();
      expect(company.name).toEqual('Linnify');
      expect(company.description).toEqual('Simplifying life through innovation');
      expect(company.website).toEqual('https://linnify.com')
      expect(company.numberOfEmployees).toEqual(40);

      const databaseEntity = await getRepository(Company).findOne({where: { id: company.id }});

      expect(databaseEntity).not.toBeUndefined();
    })

    it('Should create new entity and replace default values with specified attributes', async () => {
      const NEW_EMPLOYEES_NUMBER = 100;
      const company: Company = await new CompanyFactory().create({numberOfEmployees: NEW_EMPLOYEES_NUMBER});

      expect(company.id).not.toBeUndefined();
      expect(company.name).toEqual('Linnify');
      expect(company.description).toEqual('Simplifying life through innovation');
      expect(company.website).toEqual('https://linnify.com')
      expect(company.numberOfEmployees).toEqual(NEW_EMPLOYEES_NUMBER);

      const databaseEntity = await getRepository(Company).findOne({ where: { id: company.id }});

      expect(databaseEntity).not.toBeUndefined();
      expect(databaseEntity?.numberOfEmployees).toEqual(NEW_EMPLOYEES_NUMBER);
    })

    it('Should create entity together with relation from subfactory when subfactory exists', async () => {
      const project: Project = await new ProjectFactory().create();

      expect(project.id).not.toBeUndefined();
      expect(project.company.id).not.toBeUndefined();

      const relationEntity = await getRepository(Company).findOne({ where: { id: project.company.id }});
      const createdProject = await getRepository(Project).findOne( { where: { id: project.id }, relations: ['company']});

      expect(createdProject?.company.id).toEqual(project.company.id);
      expect(relationEntity).not.toBeUndefined();
    })

    it('Should increment sequence after every entity created with factory', async () => {
      const projects: Project[] = await new ProjectFactory().createMany(3);

      projects.forEach((project: Project, index: number) => {
        expect(project.price).toEqual(index * 1000);
      })
    })

  it('Should get the entity when getOrCreate implemented and the attributes are the same', async () => {
    const userFactory: UserFactory = new UserFactory();

    const user: User = await userFactory.create();
    const sameUser: User = await userFactory.create();

    expect(user.id).toEqual(sameUser.id);
    expect(user.firstName).toEqual(sameUser.firstName);
    expect(user.lastName).toEqual(sameUser.lastName);
    expect(user.email).toEqual(sameUser.email);

    const totalUsersCount: number = await getRepository(User).count();

    expect(totalUsersCount).toEqual(1);
  })

  it('Should get the entity when getOrCreate implemented and the attributes sent are the same', async () => {
    const userFactory: UserFactory = new UserFactory();

    const user: User = await userFactory.create();
    const sameUser: User = await userFactory.create({email: 'darius.bogdan@linnify.com'});

    expect(user.id).toEqual(sameUser.id);
    expect(user.firstName).toEqual(sameUser.firstName);
    expect(user.lastName).toEqual(sameUser.lastName);
    expect(user.email).toEqual(sameUser.email);

    const totalUsersCount: number = await getRepository(User).count();

    expect(totalUsersCount).toEqual(1);
  })

  it('Should create multiple entities and sub factory entities when createMany is used', async () => {
    const NUMBER_OF_PROJECTS = 15;
    const projects: Project[] = await new ProjectFactory().createMany(NUMBER_OF_PROJECTS);

    const totalProjectsCount: number = await getRepository(Project).count();
    const totalCompaniesCount = await getRepository(Company).count();

    expect(projects.length).toEqual(NUMBER_OF_PROJECTS);
    expect(totalProjectsCount).toEqual(NUMBER_OF_PROJECTS);
    expect(totalCompaniesCount).toEqual(NUMBER_OF_PROJECTS);
  })

  it('Should create multiple entities and single entity relation when sent as attribute when createMany is used', async () => {
    const NUMBER_OF_PROJECTS = 15;
    const company: Company = await new CompanyFactory().create();
    const projects: Project[] = await new ProjectFactory().createMany(NUMBER_OF_PROJECTS, {company});

    const totalProjectsCount: number = await getRepository(Project).count();
    const totalCompaniesCount = await getRepository(Company).count();

    expect(projects.length).toEqual(NUMBER_OF_PROJECTS);
    expect(totalProjectsCount).toEqual(NUMBER_OF_PROJECTS);
    expect(totalCompaniesCount).toEqual(1);
  })

  it('Should call the post generation functions after creating the entity', async () => {
    const companyFactory: CompanyFactory = new CompanyFactory();
    const createLogSpy = sinon.spy(companyFactory, 'createLog');
    const callAFunctionSpy = sinon.spy(companyFactory, 'callAFunction')

    const company = await companyFactory.create();

    expect(createLogSpy.calledOnce).toBeTruthy();
    expect(callAFunctionSpy.calledOnce).toBeTruthy();
    expect(FactoryStorage.storage.getPostGenerators('CompanyFactory').length).toEqual(2);
    expect(company.employees.length).toEqual(5);
  })

  it('Should allow overriding boolean factory default value to false', async () => {
    const companyFactory: CompanyFactory = new CompanyFactory();

    const createdCompany = await companyFactory.create({active: false});

    expect(createdCompany.active).toEqual(false);
  })

  it('Should allow changing the subfactory default values', async () => {
    const user = await new UserFactory().create();

    expect(user.company.name).toEqual('TypeORM Factory');
  })
});
