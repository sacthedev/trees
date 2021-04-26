// const express = require('express');
const {knex} = require('knex');
const knexFile = require('./knexfile').development;
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const db = knex(knexFile);
const cors = require('cors');
const express = require('express');


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

  type Query {
    getAllTrees: [final_tree],
  }
  
  type Mutation {
    insertTree(
      primary_name: String,
      scientific_name: String,
      botanical_description: String, 
      field_characteristics: String,
      ): final_tree,
  }
 `);
/*
 type Mutation {
    insertTree(primary_name: String, scientific_name: String): tree,
    updateTreeWithId(id: ID, primary_name: String, scientific_name: String): tree,
    deleteTreeWithId(id: ID): ID
  }
*/
const funcGetAllTrees = async () => {
  return await db.select().table('basic_tree')
      .then(async (res) => {
        const finalTreeObjectCollection = [];
        await Promise.all(
            res.map(async (basicTreeObject) => {
	      // get all references within vernacular_name_reference by basicTreeObject.id
	      const vernacularNameReferenceCollection = await getVernacularNameReference(basicTreeObject);
	      console.log(vernacularNameReferenceCollection);

	      const vernacularNameObjectCollection = [];

	      // get vernacular names according to reference
	      await Promise.all(
                  vernacularNameReferenceCollection.map(async (refObject) => {
		  const tempObj = await getVernacularNameWithId(refObject);
		  vernacularNameObjectCollection.push(tempObj);
                  }),
	      );

	      // add vernacular_names to basicTreeObject
	      basicTreeObject['vernacular_names'] = vernacularNameObjectCollection;
	      console.log(basicTreeObject);
	      // push the final object to finalTreeObjectCollection
	      finalTreeObjectCollection.push(basicTreeObject);
	    }),
        );
        console.log('finalTree: ', finalTreeObjectCollection);
        return finalTreeObjectCollection;
      });
};

const getVernacularNameReference = async (args) => {
  return await db
      .where('basic_tree_id', args.id)
      .from('vernacular_name_reference')
      .then((obj) => {
        return obj;
      });
};

const getVernacularNameWithId = async (args) => {
  console.log('getVernacularNameWithId');
  return await db
      .where('id', args.vernacular_name_id)
      .from('vernacular_name')
      .then((obj) => {
	  return obj[0];
      });
};

const funcInsertTree = async ({primary_name, scientific_name}) => {
  return db('basic_tree')
      .insert({primary_name, scientific_name})
      .returning('id')
      .then((resp_id) => {
        console.log(resp_id);
        return funcGetTreeWithId({id: resp_id[0]});
      });
};


const funcGetTreeWithId = async (args) => {
  return await db
      .where('id', args.id)
      .from('basic_tree')
      .then((r) => {
        console.log('r ->', r[0]);
        return r[0];
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
/*
const root = {
  getAllTrees: funcGetAllTrees,
  getTreeWithId: funcGetTreeWithId,
  insertTree: funcInsertTree,
  updateTreeWithId: funcUpdateTree,
  deleteTreeWithId: funcDeleteTreeWithId,
};
*/

const root = {
  getAllTrees: funcGetAllTrees,
  insertTree: funcInsertTree,
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
