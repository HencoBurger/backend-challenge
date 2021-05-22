# Overview

Create a backend service that allows someone to build a form schema. The schema should allow a front-end client to render a compliant form. A collection of Postman routes are provided to help you debug your service. Of note, many of these will fail until you've implemented the service.

The service should use Node and Express. It is recommended to use MySQLite - setup instructions provided below. The majority of the code must be original.

The service should store each field definition in a new row of a table. To demonstrate your system, ensure it can support the following schema:

```
[{
  "type": "text",
  "name": "firstName",
  "required": true
},{
  "type": "text",
  "name": "lastName",
  "required": true
},{
  "type": "date",
  "name": "dob",
  "required": true
},{
  "type": "email",
  "name": "email",
  "pattern": "[a-z0-9.]+@[a-z0-9.]+.com"
},{
  "type": "group",
  "name": "emergencyContact",
  "fields": "[{"
    "type": "text",
    "name": "firstName",
    "required": true
  },{
    "type": "text",
    "name": "lastName",
    "required": true
  },{
    "type": "email",
    "name": "email",
    "pattern": "[a-z0-9.]+@[a-z0-9.]+.com"
  }]
}]
```

Initially complete the following:

- Flesh out the remaining properties in the fields table.
- Create a seed file that populates the above schema.

Try to complete as many of the following tasks as possible (in no particular order):

- Allow fields to be added, edited and deleted.
- Run the validation on submission and reject any non-compliant forms.
- Allow completed forms to be submitted, stored and retrieved.
- To avoid duplicating the form structure, allow a child element to be descendent of multiple parent fields. Update the form above to allow the firstName, lastName and email fields to be shared.

# Getting started

## Set up

```
yarn install

# Initialise DB (structure and seed)
yarn db:init

# Start the server
yarn start

# Reset
yarn db:reset
```

## Knex commands

Create seed and migrations using Knex:

| Command                | Purpose                |
| ---------------------- | ---------------------- |
| knex migrate:make NAME | Create a new migration |
| knex seed:make NAME    | Create and apply seed  |
