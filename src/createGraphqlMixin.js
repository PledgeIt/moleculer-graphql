/**
 * @file Generate a mixin with graphql!
 */

import {
  makeExecutableSchema,
} from 'graphql-tools';
import { graphql as execute } from 'graphql';

export const createGraphqlMixin = ({
  typeName,
  schema,
  resolvers,
  relationships,
  relationDefinitions,
  directiveResolvers,
}) => ({
  settings: {
    typeName,
    schema,
    relationships,
    relationDefinitions,
    hasGraphQLSchema: true,
  },
  actions: {
    graphql: {
      params: {
        query: { type: 'string' },
        variables: { type: 'object', optional: true },
      },
      handler(ctx) {
        return execute(this.schema, ctx.params.query, this.resolvers, ctx, ctx.params.variables);
      },
    },
  },
  created() {
    this.resolvers = resolvers;
    this.schema = makeExecutableSchema({ typeDefs: [schema], resolvers, directiveResolvers });
  },
  started() {
    this.broker.broadcast('graphqlService.connected', {
      typeName,
      schema,
      relationships,
      relationDefinitions,
      directiveResolvers,
    });
  },
  stopped() {
    this.broker.broadcast('graphqlService.disconnected', { typeName });
  },
});
