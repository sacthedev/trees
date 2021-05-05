// const express = require('express');
const {knex} = require('knex');
const knexFile = require('./knexfile').development;
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const cors = require('cors');
const express = require('express');
const {funcGetAllTrees, funcGetTreeWithId, funcInsertTreeWithVernacularNames, funcUpdateTreeWithoutVernacularNames, funcDeleteTreeWithId} = require('./functions/basic_tree.js');

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
    getAllTrees: [final_tree],
    getTreeWithId(id:ID!): final_tree,
  }
  
  type Mutation {
    insertTreeWithVernacularNames(
      primary_name: String,
      scientific_name: String,
      vernacular_names: [ vernacular_name_input ],
      ): final_tree,

    updateTreeTreeWithoutVernacularNames(
      id: ID!,
      primary_name: String,
      scientific_name: String,
      ): final_tree,

    deleteTreeWithId(id: ID!): ID,
  }
     `);
/*
 type Mutation {
    insertTree(primary_name: String, scientific_name: String): tree,
    updateTreeWithId(id: ID, primary_name: String, scientific_name: String): tree,
    deleteTreeWithId(id: ID): ID
  }
*/
/*
const root = {
  getAllTrees: funcGetAllTrees,
  getTreeWithId: funcGetTreeWithId,
  insertTree: funcInsertTreeWithVernacularNames,
  updateTreeWithId: funcUpdateTreeWithoutVernacularNames,
  deleteTreeWithId: funcDeleteTreeWithId,
};
*/

const root = {
  getAllTrees: funcGetAllTrees,
  getTreeWithId: funcGetTreeWithId,
  insertTreeWithVernacularNames: funcInsertTreeWithVernacularNames,
  updateTreeWithoutVernacularNames: funcUpdateTreeWithoutVernacularNames,
  deleteTreeWithId: funcDeleteTreeWithId,
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
