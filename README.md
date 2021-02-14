# Typeorm Factory


[![codecov](https://codecov.io/gh/linnify/typeorm-factory/branch/main/graph/badge.svg)](https://codecov.io/gh/linnify/typeorm-factory)
[![Build Status](https://travis-ci.com/linnify/typeorm-factory.svg?branch=main)](https://travis-ci.com/linnify/typeorm-factory)

This package makes testing easier by creating factories for your TypeORM entities. It is inspired by the python package [Factory Boy](https://github.com/FactoryBoy/factory_boy).

## Installation

#### NPM

```bash
npm install @linnify/typeorm-factory --save-dev
```

#### Yarn

```bash
yarn add @linnify/typeorm-factory --dev
```


## Usage

This section provides examples on how to use this library's features.

### Factories

#### Declaration

For declaring a factory, we make use of typescript classes and add as properties on the class the fields from our entity with the desired values

```typescript
export class NormalUserFactory extends Factory<User> {
  entity = User;
  
  firstName = 'John'
  lastName = 'Doe'
  email = 'john.doe@typeorm-factory.com'
  role = 'normal_user'
}

export class AdminUserFactory extends Factory<User> {
  entity = User;

  firstName = 'Admin'
  lastName = 'Factory'
  email = 'admin@typeorm-factory.com'
  role = 'admin'
}
```

#### Usage

After defining our factories, we can make use of them by creating a new instance of a factory:

```typescript
const userFactory: NormalUserFactory = new NormalUserFactory();
```

When creating the factory, we make user of the create function. By default, the entity created and saved to the database by using the properties defined on the factory.

```typescript
const user: User = await userFactory.create();
```

If we want to modify the default attributes from the factory, we add them as parameter to the create function:


```typescript
const user: User = await userFactory.create({firstName: 'AnotherFirstName', lastName: 'AnotherLastName'});
```

We can create multiple instances by using the `createMany` function. In the below example we create 5 users:

```typescript
const users: User[] = await userFactory.createMany(5)
```

In the case when we have some unique attributes by which we define entities. We do not want to create multiple objects with some properties, we make use of the `getOrCreate` function. We define the attributes by which the entity should be unique. Calling the create method multiple times will return the same object.

In our example, we do not want to create 2 users with the same email.

```typescript
export class NormalUserFactory extends Factory<User> {
  ...

  protected getOrCreate(): string[] {
    return ['email'];
  }
}
...

// Creates the user 
const user: User = await userFactory.create();

// Gets the user that was created above
const sameUser: User = await userFactory.create();

```
### SubFactories

A common case is that the entities have relations between them. In this case we create factories for all the entities and make use of `SubFactory` to create a link between them.

#### Example

If the user has multiple addresses we add the `UserFactory` as a subfactory on the `AddressFactory`

```typescript
export class AddressFactory extends Factory<Address> {
  street = 'Factory Street'
  number = '100'
  user = new SubFactory(UserFactory)
}
```

### Sequences

We can add sequences on our factories when we want a property to have a different every time we create an object using the same factory

```typescript
export class NormalUserFactory extends Factory<User> {
  ...
  email = new Sequence((i: number) => `john.doe.${i}@typeorm-factory.com`)

}
```

### Post Generations

Sometimes we have the need to call some functions after the object was created. For this, we have created a `PostGeneration` decorator that can be used on multiple functions and all of them will be called after the entity was created.

```typescript
export class NormalUserFactory extends Factory<User> {
  ...
  
  @PostGeneration()
  addLogsForUser() {
    // create some logs for the created user
  }
  
  @PostGeneration()
  anotherFunctionToBeCalled() {
    
  }
}
```
