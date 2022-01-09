# GraphQL to Prisma

A tool to bridge the gap between GraphQL and Prisma by:

- Generating GraphQL Schema from Prisma Schema
- Automatically resolving GraphQL queries based on Prisma

Makes it super easy to create GraphQL resolvers using Prisma in

- Javascript and Typescript with any `graphql-js` compatible library (Bare GraphQL, Apollo, GraphQL-Tools, etc.)
- Python using Graphene

## Typescript

Using [Official Prisma client](https://www.prisma.io/docs/concepts/components/prisma-client)

### Install Typescript tools

```bash
yarn install
```

### Develop Typescript with hot reload

```bash
yarn test
```

## Python

Using [Prisma client python](https://prisma-client-py.readthedocs.io/en/stable/)

### Install Python tools

```bash
python3 -m venv ./.venv
source ./.venv/bin/activate
pip install -r requirements.txt
```

### Develop Python with hot reload

```bash
source ./.venv/bin/activate
ptw -- -s
```
