

export type PrismaSelect = {
  [key: string]: boolean | {
    select: PrismaSelect
  }
}
export type PrismaCursor = { [key: string]: string };
export type PrismaDistinct = string[];
export type PrismaOrderBy = {
  [key: string]: "asc" | "desc" | PrismaOrderBy
}
export type PrismaSkip = number;
export type PrismaTake = number;
export type PrismaWhere = {
  [key: string]: any
}

export type GraphQLCursor = PrismaCursor;
export type GraphQLDistinct = PrismaDistinct;
export type GraphQLOrderBy = PrismaOrderBy;
export type GraphQLSkip = PrismaSkip;
export type GraphQLTake = PrismaTake;
export type GraphQLWhere = PrismaWhere;


export type PrismaFindManyArguments = {
  cursor: PrismaCursor,
  distinct: PrismaDistinct,
  orderBy: PrismaOrderBy,
  select: PrismaSelect,
  skip: PrismaSkip,
  take: PrismaTake,
  where: PrismaWhere
};



export type GraphQLFindManyArgs = {
  cursor: GraphQLCursor,
  distinct: GraphQLDistinct,
  orderBy: GraphQLOrderBy,
  skip: GraphQLSkip,
  take: GraphQLTake,
  where: GraphQLWhere
};
