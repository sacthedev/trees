// const express = require('express');
const {knex} = require('knex');
const knexFile = require('./knexfile').development;
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const db = knex(knexFile);
const cors = require('cors');
const express = require('express');

const funcGetAllTrees = async () => {
  return await db.select().table('trees').then((res) => {
    return res;
  });
};

const funcGetTreeWithId = async (args) => {
  return await db
      .where('id', args.id)
      .from('trees')
      .then((r) => {
        console.log('r ->', r[0]);
        return r[0];
      });
};

const funcInsertTree = async ({primary_name, scientific_name}) => {
  return db('trees')
      .insert({primary_name, scientific_name})
      .returning('id')
      .then((resp_id) => {
        console.log(resp_id);
        return funcGetTreeWithId({id: resp_id[0]});
      });
};

const funcUpdateTree = async ({id, primary_name, scientific_name}) => {
  console.log('funcUpdateTree');
  let updated_time = new Date(Date.now()).toISOString().replace(/T|Z/gi, ' ');
  updated_time = updated_time.substr(0, updated_time.length - 1) + '-04';
  const updated_at = updated_time;
  console.log('updated TIME NOW ->', updated_at);
  return db('trees')
      .where('id', id)
      .update({primary_name, scientific_name, updated_at: updated_at})
      .then(() => {
        return funcGetTreeWithId({id: id});
      });
};

const funcDeleteTreeWithId = async ({id}) => {
  const thisId = id;
  return db('trees')
      .where('id', id)
      .del()
      .then(() => {
        console.log(thisId);
        return thisId;
      });
};
const schema = buildSchema(`
  type tree {
    id: ID,
    primary_name: String,
    scientific_name: String,
  }

  type Query {
    getTreeWithId(id: ID): tree,
    getAllTrees: [tree],
  }

 type Mutation {
    insertTree(primary_name: String, scientific_name: String): tree,
    updateTreeWithId(id: ID, primary_name: String, scientific_name: String): tree,
    deleteTreeWithId(id: ID): ID
  }
`);

const root = {
  getAllTrees: funcGetAllTrees,
  getTreeWithId: funcGetTreeWithId,
  insertTree: funcInsertTree,
  updateTreeWithId: funcUpdateTree,
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
