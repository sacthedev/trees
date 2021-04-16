const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const rootFuncs = require('./rootFuncs');
const cors = require('cors');
const schema = buildSchema(`
    type tree {
      id: ID,
      common_name: String,
      scientific_name: String,
    }

    type Query {
        tree(id: ID): tree,
        getAllTrees: [tree],
    }

    type Mutation {
        insertTree(common_name: String, scientific_name: String): tree,
        updateTreeWithId(id: ID, common_name: String, scientific_name: String): tree,
        deleteTreeWithId(id: ID): ID
    }
`);

const root = {...rootFuncs};
const app = express();
app.use(cors());
app.use(
    '/graphql',
    graphqlHTTP({
      schema: schema,
      rootValue: root,
      graphiql: true,
    }),
);

app.listen(4000);

console.log(`Running a GraphQL API server at http://localhost:4000/graphql`);
