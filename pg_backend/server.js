// const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const cors = require('cors');
const express = require('express');
const {
  funcGetAllTrees,
  funcGetTreeWithID,
  funcInsertTree,
  funcUpdateTreeWithID,
  funcDeleteTreeWithID,
} = require('./functions/basic_tree.js');
const {
  funcGetAllVernacularName,
  funcInsertVernacularName,
  funcDeleteVernacularNameWithId,
} = require('./functions/vernacular_name');

const {
  funcInsertVernacularNameReference,
} = require('./functions/vernacular_name_reference');

const schema = buildSchema(`
  type final_tree {
    id: ID
    created_at: String,
    updated_at: String,
    primary_name: String,
    scientific_name: String,
    botanical_description: String,
    field_characteristics: String,
    vernacular_names: [vernacular_name],
  }

  type vernacular_name {
    id: ID,
    vernacular_name: String,
  }
 
  input vernacular_name_input {
    id: ID,
    vernacular_name: String,
  }

  type Query {
    getAllVernacularNames: [vernacular_name],
    getAllTrees: [final_tree],
    getTreeWithID(id:ID!): final_tree,
  }
  
  type Mutation {
    insertTree(
      primary_name: String,
      scientific_name: String,
      vernacular_names: [ vernacular_name_input ],
      ): final_tree,

    updateTreeWithID(
      id: ID!,
      primary_name: String,
      scientific_name: String,
      vernacular_names: [vernacular_name_input],
    ): final_tree

    insertVernacularName(
      vernacular_name: String,
    ): vernacular_name
      
    insertVernacularNameReference(
      vernacular_name_id: ID,
      basicTreeId: ID
    ):ID,

    deleteVernacularNameWithId(id: ID): ID,

    deleteTreeWithID(id: ID!): ID,
  }
     `);

const root = {
  getAllTrees: funcGetAllTrees,
  getAllVernacularNames: funcGetAllVernacularName,
  getTreeWithID: funcGetTreeWithID,
  insertTree: funcInsertTree,
  updateTreeWithID: funcUpdateTreeWithID,
  deleteTreeWithID: funcDeleteTreeWithID,
  deleteVernacularNameWithId: funcDeleteVernacularNameWithId,
  insertVernacularName: funcInsertVernacularName,
  insertVernacularNameReference: funcInsertVernacularNameReference,
};

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

const PORT = 5555;
app.listen(PORT);

console.log(`Running a GraphQL API server at http://localhost:${5555}/graphql`);
