import { beforeAll, expect, it, describe } from "vitest";
import { $ } from "zx";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { execute, GraphQLResolveInfo } from "graphql";
import gql from "graphql-tag";

import { generatePrismaFindManyArguments } from "../../../src/generate-prisma-arguments";

$.verbose = false;

beforeAll(async () => {

  expect(
    (await $`rm -rf ./test/case01/prisma/generated`).stderr.toString()
  ).toEqual("");
  expect(
    (await $`rm -f ./test/case01/prisma/sqlite.db`).stderr.toString()
  ).toEqual("");
  expect(
    (await $`rm -f ./test/case01/prisma/sqlite.db-journal`).stderr.toString()
  ).toEqual("");
  expect((await $`ls ./test/case01/prisma`).stdout.toString()).toEqual(
    "migrations\nschema.prisma\n"
  );

  expect(
    (
      await $`yarn prisma migrate dev --schema ./test/case01/prisma/schema.prisma`
    ).stderr.toString()
  ).toEqual("");

  const { PrismaClient } = await import("../prisma/generated/typescript");
  const prisma = new PrismaClient();

  await prisma.user.create({
    data: {
      email: "foo@example.com",
    },
  });

  await prisma.user.create({
    data: {
      email: "bar@example.com",
    },
  });

  await prisma.post.create({
    data: {
      title: "hello world",
      author: {
        connect: {
          email: "foo@example.com",
        },
      },
    },
  });
});

const typeDefs = gql`
  type User {
    id: Int!
    email: String
    name: String
    posts: [Post]
  }

  type Post {
    id: Int!
    title: String
    author: User
    votes: Int
  }

  # the schema allows the following query:
  type Query {
    posts: [Post]
    users: [User]
  }
`;

it("trivial", async () => {
  expect(1).toEqual(1);
})


it("basic", async () => {
  const { PrismaClient } = await import("../prisma/generated/typescript");
  const prisma = new PrismaClient();
  expect(await prisma.profile.count()).toEqual(0);
  expect(Object.keys(prisma)).toEqual([
    "_middlewares",
    "_transactionId",
    "_rejectOnNotFound",
    "_clientVersion",
    "_activeProvider",
    "_clientEngineType",
    "_errorFormat",
    "_dmmf",
    "_previewFeatures",
    "_engineConfig",
    "_engine",
    "_fetcher",
    "post",
    "profile",
    "user",
  ]);
});



// it("dmmf", async () => {
//   const { Prisma } = await import("../prisma/generated/typescript");
//   // console.log(Object.keys(Prisma.dmmf.schema.outputObjectTypes));
//   console.log(
//     Prisma.dmmf.schema.inputObjectTypes.prisma.find(
//       ({ name }) => name === "PostWhereInput"
//     )?.fields.find(({ name }) => name === "author"));
//   console.log(
//     Prisma.dmmf.schema.inputObjectTypes.prisma.find(
//       ({ name }) => name === "UserRelationFilter"
//     ));
//   console.log(
//     Prisma.dmmf.schema.inputObjectTypes.prisma.find(
//       ({ name }) => name === "UserWhereInput"
//     ));
// });

describe("graphql", async () => {
  const { PrismaClient } = await import("../prisma/generated/typescript");
  const prisma = new PrismaClient();

  const resolvers = {
    Query: {
      posts: async (
        source: any,
        args: any,
        context: any,
        info: GraphQLResolveInfo
      ) => {
        return await prisma.post.findMany(
          generatePrismaFindManyArguments(args, info) as any
        );
      },
      users: async (
        source: any,
        args: any,
        context: any,
        info: GraphQLResolveInfo
      ) => {
        return await prisma.user.findMany(
          generatePrismaFindManyArguments(args, info) as any
        );
      },
    },
  };

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  it("test-1", async () => {
    expect(
      await execute({
        schema,
        rootValue: {},
        contextValue: {},
        document: gql`
          query {
            posts {
              title
              author {
                email
              }
            }
          }
        `,
      })
    ).toEqual({
      data: {
        posts: [
          {
            title: "hello world",
            author: {
              email: "foo@example.com",
            },
          },
        ],
      },
    });
  });

  it("test-2", async () => {
    expect(
      await execute({
        schema,
        document: gql`
          query {
            users {
              id
              posts {
                title
              }
            }
          }
        `,
      })
    ).toEqual({
      data: {
        users: [
          {
            id: 1,
            posts: [
              {
                title: "hello world",
              },
            ],
          },
          {
            id: 2,
            posts: [],
          },
        ],
      },
    });
  });
});
