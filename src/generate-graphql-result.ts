/**
 * Generate GraphQL result from Prisma result and a GraphQL query
 */
import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql';

export const generateGraphQLResult = (prismaResult: any, resolveInfo: GraphQLResolveInfo) => {
  // source: TSource,
  // args: TArgs,
  // context: TContext,
  // info: GraphQLResolveInfo,
};