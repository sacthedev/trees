var express = require("express");
var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");
const rootFuncs = require("./rootFuncs");
var cors = require("cors");
var schema = buildSchema(`
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

var root = { ...rootFuncs };
var app = express();
app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4000);

console.log(`Running a GraphQL API server at http://localhost:4000/graphql`);
