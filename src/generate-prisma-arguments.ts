/**
 * Generate Prisma client call arguments from a GraphQL query
 */
import { FieldNode, GraphQLResolveInfo, SelectionNode } from "graphql";
import {
  GraphQLFindManyArgs,
  PrismaFindManyArguments,
  PrismaSelect,
} from "./types";

/**
 * Transforms a graphql selection node to a list of field nodes (unpacking fragments in the process)
 */
const selectionNodeToFieldNodes = (selection: SelectionNode): FieldNode[] => {
  switch (selection.kind) {
    case "Field": {
      return [selection as FieldNode];
    }
    case "FragmentSpread": {
      throw new Error(`Unsupported selection kind: ${selection.kind}`);
    }
    case "InlineFragment": {
      return selection.selectionSet.selections.flatMap(
        selectionNodeToFieldNodes
      );
    }
  }
};

/**
 * Transforms a list of graphql field nodes to a prisma select argument
 */
const fieldNodesToPrismaSelect = (
  fieldNodes: readonly FieldNode[]
): PrismaSelect => {
  return Object.fromEntries(
    fieldNodes.map((fieldNode) => {
      if (fieldNode.selectionSet) {
        // branch of the graphql selection set
        return [
          fieldNode.name.value,
          {
            select: fieldNodesToPrismaSelect(
              fieldNode.selectionSet.selections.flatMap(
                selectionNodeToFieldNodes
              )
            ),
          },
        ];
      } else {
        // leaf of the graphql selection set
        return [fieldNode.name.value, true];
      }
    })
  );
};


/**
 * Given fieldNodes A and a path, return the fieldNodes B at the path inside fieldNodes A
 * TODO: Manage cases with depth > 1 if needed
 */
const drillDownPath = ({ path, fieldNodes }: Pick<GraphQLResolveInfo, "path" | "fieldNodes">) => {
  const fieldNode = fieldNodes.find((fieldNode) => {
    return fieldNode.name.value === path.key
  })
  if (!fieldNode) {
    throw new Error(`Could not find field node for ${path.key}`)
  }
  if (!fieldNode.selectionSet) {
    throw new Error(`No selection set for ${path.key}`)
  }
  const subFieldNodes = fieldNode.selectionSet.selections.flatMap(selectionNodeToFieldNodes);
  return subFieldNodes;
}

/**
 * generate prisma arguments from a graphql findmany query
 * @param args
 * @param info
 * @returns
 */
export const generatePrismaFindManyArguments = <
  TArgs extends GraphQLFindManyArgs
>(
  args: TArgs,
  info: GraphQLResolveInfo
): PrismaFindManyArguments => {

  // We need to go down one step in the tree
  const subFieldNodes = drillDownPath(info)

  // Convert the selection set to prisma select, keep the rest as-is
  return {
    cursor: args.cursor,
    distinct: args.distinct,
    orderBy: args.orderBy ?? { id: "asc" },
    select: fieldNodesToPrismaSelect(subFieldNodes),
    skip: args.skip,
    take: args.take,
    where: args.where,
  };
};
